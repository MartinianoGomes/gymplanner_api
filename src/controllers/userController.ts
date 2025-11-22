import { type FastifyRequest, type FastifyReply, fastify } from 'fastify';
import { prisma } from "../lib/prisma.js";
import type { User } from "../types/user.js";
import { hash } from "bcryptjs";
import { login, logout } from '../services/userServices.js';
import { loginSchema } from '../schemas/loginSchema.js';
import { userSchema } from '../schemas/userSchema.js';

const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
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
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }

    if (!id) return reply.status(400).send({ error: "Please provide the user ID." })

    const validateUserInformations = userSchema.partial().safeParse(request.body as User);
    if (!validateUserInformations.success) return reply.status(400).send({ error: "Invalid user informations." })

    const { name, email, password } = validateUserInformations.data;

    const updateData: {
        name?: string;
        email?: string;
        password?: string;
    } = {};

    if (name) updateData.name = name;

    if (email) updateData.email = email.toLocaleLowerCase();

    if (password) updateData.password = await hash(password, 10);;

    try {
        const userUpdated = await prisma.user.update({
            where: { id: id },
            data: updateData
        })

        const { password, ...userWithoutPassword } = userUpdated;

        return userWithoutPassword;
    } catch (error) {
        return reply.status(404).send({ error: "User not found!" });
    }
}

const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return users;
    } catch (error) {
        return reply.status(404).send({ error: "Users not found." });
    }
}

const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    if (!id) return reply.status(404).send({ error: "User not found." });

    try {
        await prisma.user.delete({
            where: { id }
        })

        return reply.status(200).send({ message: "User deleted successfully!" });
    } catch (error) {
        return reply.status(404).send({ error: "Unable to delete the user. An error occurred." });
    }
}

const userLogin = async (request: FastifyRequest, reply: FastifyReply) => {
    const validateCredentials = loginSchema.safeParse(request.body as User);
    if (!validateCredentials.success) return reply.status(400).send({ error: "Invalid credentials." })

    const { email, password } = validateCredentials.data;

    const token = await login(request.server, email, password);
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

const userLogout = async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.token;
    if (!token) return reply.status(401).send({ error: "User not logged in." });

    await logout(reply);

    return reply.status(200).send({ message: "User logged out successfully." });
}

export { createUser, updateUser, getAllUsers, deleteUser, userLogin, userLogout }