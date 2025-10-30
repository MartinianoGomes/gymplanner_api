import { type FastifyRequest, type FastifyReply, fastify } from 'fastify';
import { prisma } from "../lib/prisma.js";
import type { User } from "../types/user.js";
import { compare, hash } from "bcryptjs";
import { getUserByToken, login } from '../services/userServices.js';

const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, email, password } = request.body as User;

    const userAlreadyExist = await prisma.user.findUnique({ where: { email } });

    if (userAlreadyExist) return null;

    const hashPassword = await hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name: name,
            email: email.toLowerCase(),
            password: hashPassword,
        }
    });

    if (!user) return null;

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }

    const { name, email, password } = request.body as Partial<User>;

    const updateData: {
        name?: string;
        email?: string;
        password?: string;
    } = {};

    if (name) updateData.name = name;

    if (email) updateData.email = email.toLocaleLowerCase();

    if (password) updateData.password = await hash(password, 10);

    try {
        const userUpdated = await prisma.user.update({
            where: { id: id },
            data: updateData
        })

        if (!userUpdated) return null

        return userUpdated;
    } catch (error) {
        return reply.status(404).send({ error, message: "User not found!" })
    }
}

const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const users = await prisma.user.findMany();

        if (!users) return null

        return JSON.stringify(users);
    } catch (error) {
        return reply.status(404).send({ error, message: "Users not found!" })
    }
}

const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    if (!id) return null

    try {
        await prisma.user.delete({
            where: { id }
        })

        return reply.status(200).send({ message: "User deleted successfully!" })
    } catch (error) {
        return reply.status(404).send({ error, message: "Unable to delete the user. An error occurred." })
    }
}

const userLogin = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as User;
    if (!email || !password) return null;

    login(request.server, email, password);
}

export { createUser, updateUser, getAllUsers, deleteUser, userLogin }