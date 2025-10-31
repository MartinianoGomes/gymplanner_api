import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from "../lib/prisma.js";
import type { Exercise } from "../types/exercise.js";

const createExercise = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { name, description, groupMuscleId } = request.body as Exercise;

    const exercise = await prisma.exercise.create({
      data: { name, description, groupMuscleId }
    });

    return reply.status(201).send(exercise);
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to create exercise." });
  }
}

const getAllExercises = async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    const exercises = await prisma.exercise.findMany();
    return reply.status(200).send(exercises);
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to fetch exercises." });
  }
}

const getExerciseById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const exercise = await prisma.exercise.findUnique({ where: { id } });
    if (!exercise) return reply.status(404).send({ message: "Exercise not found." });
    return reply.status(200).send(exercise);
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to fetch exercise." });
  }
}

const updateExercise = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const { name, description, groupMuscleId } = request.body as Exercise;

    const updated = await prisma.exercise.update({
      where: { id },
      data: { name, description, groupMuscleId }
    });

    return reply.status(200).send(updated);
  } catch (error) {
    return reply.status(404).send({ error, message: "Unable to update the exercise. It may not exist." });
  }
}

const deleteExercise = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    await prisma.exercise.delete({ where: { id }});
    return reply.status(200).send({ message: "Exercise deleted successfully!" });
  } catch (error) {
    return reply.status(404).send({ error, message: "Unable to delete the exercise. An error occurred." });
  }
}

export { createExercise, getAllExercises, getExerciseById, updateExercise, deleteExercise }
