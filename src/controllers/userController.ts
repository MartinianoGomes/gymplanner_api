import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from "../lib/prisma.js";
import type { User } from "../types/user.js";
import { compare, hash } from "bcryptjs";
import { v4 } from "uuid";

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
    const { name, email, password } = request.body as User;

    const hashPassword = await hash(password, 10);

    const userUpdated = await prisma.user.update({
        where: { email },
        data: {
            name: name,
            email: email,
            password: hashPassword
        }
    });

    if (!userUpdated) return null

    return userUpdated;
}

// const getUser = (req, res) => { }

// const getUserById = (req, res) => { }

// const deleteUser = (req, res) => { }

export { createUser }