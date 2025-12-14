import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from "../lib/prisma.js";
import type { Exercise } from "../types/exercise.js";
import { exerciseSchema } from '../schemas/exerciseSchema.js';

export const createExercise = async (request: FastifyRequest, reply: FastifyReply) => {
  const validateExerciseInformations = exerciseSchema.safeParse(request.body as Exercise);
  if (!validateExerciseInformations.success) return reply.status(400).send({ error: "Invalid exercise informations." });

  try {
    const { name, description, groupMuscleId } = validateExerciseInformations.data;

    const exercise = await prisma.exercise.create({
      data: {
        name: name,
        description: description,
        groupMuscleId: groupMuscleId
      }
    });

    return {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      groupMuscleId: exercise.groupMuscleId,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt
    };
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to create exercise." });
  }
}

export const getAllExercises = async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    const exercises = await prisma.exercise.findMany();

    return exercises;
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to fetch exercises." });
  }
}

export const getExerciseById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  if (!id) return reply.status(400).send({ error: "Please provide the exercise ID." })

  try {
    const exercise = await prisma.exercise.findUnique({ where: { id } });

    if (!exercise) return reply.status(404).send({ message: "Exercise not found." });

    return reply.status(200).send(exercise);
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to fetch exercise." });
  }
}

export const updateExercise = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  if (!id) return reply.status(400).send({ error: "Please provide the exercise ID." })

  const validateExerciseInformations = exerciseSchema.partial().safeParse(request.body as Exercise);
  if (!validateExerciseInformations.success) return reply.status(400).send({ error: "Invalid exercise informations." });

  const { name, description, groupMuscleId } = validateExerciseInformations.data;

  const updateData: {
    name?: string;
    description?: string;
    groupMuscleId?: string;
  } = {};

  if (name) updateData.name = name;
  if (description) updateData.description = description;
  if (groupMuscleId) updateData.groupMuscleId = groupMuscleId;

  try {
    const updated = await prisma.exercise.update({
      where: { id },
      data: updateData
    });

    return updated;
  } catch (error) {
    return reply.status(404).send({ error, message: "Unable to update the exercise. It may not exist." });
  }
}

export const deleteExercise = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  if (!id) return reply.status(400).send({ error: "Please provide the exercise ID." })

  try {
    // Primeiro deletar todos os exercícios em workouts vinculados
    await prisma.exercisesInWorkout.deleteMany({
      where: { exerciseId: id }
    });

    // Depois deletar o exercício
    await prisma.exercise.delete({ where: { id } });

    return reply.status(200).send({ message: "Exercise deleted successfully!" });
  } catch (error) {
    return reply.status(404).send({ error, message: "Unable to delete the exercise. An error occurred." });
  }
}
