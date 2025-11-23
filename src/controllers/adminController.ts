import { type FastifyRequest, type FastifyReply } from 'fastify';
import { prisma } from "../lib/prisma.js";
import type { User } from "../types/user.js";
import { hash } from "bcryptjs";
import { userSchema } from '../schemas/userSchema.js';

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
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

export const getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return user;
}

export const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
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

export const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
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