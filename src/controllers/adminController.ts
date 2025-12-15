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
    if (!id) return reply.status(400).send({ error: "User ID is required." });

    try {
        // Verificar se o usuário existe
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return reply.status(404).send({ error: "User not found." });
        }

        // Buscar todos os treinos do usuário
        const workouts = await prisma.workout.findMany({
            where: { userId: id },
            select: { id: true }
        });

        // Deletar exercícios de todos os treinos do usuário
        if (workouts.length > 0) {
            const workoutIds = workouts.map(w => w.id);
            await prisma.exercisesInWorkout.deleteMany({
                where: { workoutId: { in: workoutIds } }
            });
        }

        // Deletar todos os treinos do usuário
        await prisma.workout.deleteMany({
            where: { userId: id }
        });

        // Deletar o usuário
        await prisma.user.delete({
            where: { id }
        });

        return reply.status(200).send({ message: "User deleted successfully!" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return reply.status(500).send({ error: "Unable to delete the user. An error occurred." });
    }
}

export const getAllWorkouts = async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
        const workouts = await prisma.workout.findMany({
            include: {
                ExercisesInWorkout: {
                    include: {
                        exercise: true
                    }
                }
            }
        });

        return workouts;
    } catch (error) {
        return reply.status(500).send({ error, message: "Unable to fetch workouts." });
    }
}