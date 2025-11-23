import { type FastifyRequest, type FastifyReply } from 'fastify';
import { prisma } from "../lib/prisma.js";
import type { User } from "../types/user.js";
import { hash } from "bcryptjs";
import { login, logout } from '../services/userServices.js';
import { loginSchema } from '../schemas/loginSchema.js';
import { userSchema } from '../schemas/userSchema.js';
import { getUserById } from './adminController.js';

export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const validateUserInformations = userSchema.safeParse(request.body as User);
    if (!validateUserInformations.success) return reply.status(400).send({ error: "Invalid user informations." })

    const { name, email, password } = validateUserInformations.data;

    const userAlreadyExist = await prisma.user.findUnique({ where: { email } });
    if (userAlreadyExist) return reply.status(409).send({ conflict: "This email already register." });

    const hashPassword = await hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name: name,
            email: email.toLowerCase(),
            password: hashPassword,
        }
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role?.toUpperCase(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

export const userLogin = async (request: FastifyRequest, reply: FastifyReply) => {
    const validateCredentials = loginSchema.safeParse(request.body as User);
    if (!validateCredentials.success) return reply.status(400).send({ error: "Invalid credentials." })

    const { email, password } = validateCredentials.data;

    const token = await login(request.server, email.toLowerCase(), password);
    if (!token) return reply.status(401).send({ error: "Incorrect credentials." });

    return reply
        .setCookie('token', token, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax'
        })
        .status(200)
        .send({ message: "User logged in successfully." });
}

export const userLogout = async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.token;
    if (!token) {
        await logout(reply);
        return reply.status(401).send({ error: "User not logged in." });
    }

    await logout(reply);

    return reply.status(200).send({ message: "User logged out successfully." });
}

export const getMe = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user?.userId;
    if (!userId) {
        await logout(reply);
        return reply.status(401).send({ error: "Authentication required." });
    }

    try {
        const user = await getUserById(userId);
        if (!user) {
            await logout(reply);
            return reply.status(404).send({ error: "User not found." });
        };

        return reply.status(200).send(user);
    } catch (error) {
        return reply.status(500).send({ error: "Internal server error." });
    }
}

export const updateProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user?.userId;
    if (!userId) {
        await logout(reply);
        return reply.status(401).send({ error: "Authentication required." });
    }

    const validate = userSchema.partial().safeParse(request.body);
    if (!validate.success) {
        await logout(reply);
        return reply.status(400).send({ error: "Invalid user information." });
    }

    const { name, email, password } = validate.data;

    const updateData: {
        name?: string;
        email?: string;
        password?: string;
    } = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (password) updateData.password = await hash(password, 10);

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return reply.status(200).send(updatedUser);
    } catch (error) {
        return reply.status(400).send({ error: "Unable to update profile." });
    }
}

export const deleteProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user?.userId;
    if (!userId) {
        await logout(reply);
        return reply.status(401).send({ error: "Authentication required." });
    }

    try {
        await prisma.user.delete({
            where: { id: userId }
        });

        await logout(reply);

        return reply.status(200).send({ message: "User profile deleted successfully." });
    } catch (error) {
        return reply.status(400).send({ error: "Unable to delete profile." });
    }
}