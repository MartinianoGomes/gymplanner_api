import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from "../lib/prisma.js";
import type { Workout } from "../types/workout.js";
import { v4 } from "uuid";

const createWorkout = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { title, description = null } = request.body as Workout;

    const workout = await prisma.workout.create({
      data: {
        title,
        description: description ?? null
      }
    });

    return reply.status(201).send(workout);
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to create workout." });
  }
}

const getAllWorkouts = async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    const workouts = await prisma.workout.findMany();
    return reply.status(200).send(workouts);
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to fetch workouts." });
  }
}

const getWorkoutById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const workout = await prisma.workout.findUnique({ where: { id } });
    if (!workout) return reply.status(404).send({ message: "Workout not found." });
    return reply.status(200).send(workout);
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to fetch workout." });
  }
}

const updateWorkout = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const { title, description = null } = request.body as Workout;

    const updated = await prisma.workout.update({
      where: { id },
      data: { 
        title,
        description: description ?? null
      }
    });

    return reply.status(200).send(updated);
  } catch (error) {
    return reply.status(404).send({ error, message: "Unable to update the workout. It may not exist." });
  }
}

const deleteWorkout = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    await prisma.workout.delete({ where: { id }});
    return reply.status(200).send({ message: "Workout deleted successfully!" });
  } catch (error) {
    return reply.status(404).send({ error, message: "Unable to delete the workout. An error occurred." });
  }
}

export { createWorkout, getAllWorkouts, getWorkoutById, updateWorkout, deleteWorkout }
