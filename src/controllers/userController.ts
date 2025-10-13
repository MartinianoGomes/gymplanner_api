import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from "../prisma.js";
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
            name,
            email: email.toLowerCase(),
            password: hashPassword,
            role: "user"
        }
    });

    if (!user) return null;

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

// const getUser = (req, res) => { }

// const getUserById = (req, res) => { }

// const updateUser = (req, res) => { }

// const deleteUser = (req, res) => { }

export { createUser }