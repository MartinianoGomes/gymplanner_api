import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from "../lib/prisma.js";
import type { GroupMuscle } from "../types/groupMuscle.js";
import { groupMuscleSchema } from '../schemas/groupMuscleSchema.js';

const createGroupMuscle = async (request: FastifyRequest, reply: FastifyReply) => {
  const validateGroupMuscleInformations = groupMuscleSchema.safeParse(request.body as GroupMuscle);
  if (!validateGroupMuscleInformations.success) return reply.status(400).send({ error: "Invalid group muscle informations." });

  try {
    const { name, description } = validateGroupMuscleInformations.data;

    const groupMuscle = await prisma.groupMuscle.create({
      data: {
        name: name,
        description: description
      }
    });

    return {
      id: groupMuscle.id,
      name: groupMuscle.name,
      description: groupMuscle.description,
      createdAt: groupMuscle.createdAt,
      updatedAt: groupMuscle.updatedAt
    };
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to create group muscle." });
  }
}

const updateGroupMuscle = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  if (!id) return reply.status(400).send({ error: "Please provide the muscle group ID." })

  const validateGroupMuscleInformations = groupMuscleSchema.partial().safeParse(request.body as GroupMuscle);
  if (!validateGroupMuscleInformations.success) return reply.status(400).send({ error: "Invalid group muscle informations." })

  const { name, description } = validateGroupMuscleInformations.data;

  const updateData: {
    name?: string;
    description?: string;
  } = {};

  if (name) updateData.name = name;

  if (description) updateData.description = description;

  try {
    const updated = await prisma.groupMuscle.update({
      where: { id },
      data: updateData
    });

    return updated;
  } catch (error) {
    return reply.status(404).send({ error, message: "Unable to update the group muscle. It may not exist." });
  }
}

const getAllGroupMuscles = async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    const groupMuscles = await prisma.groupMuscle.findMany();

    return groupMuscles;
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to fetch the group muscles." });
  }
}

const getGroupMuscleById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  if (!id) return reply.status(400).send({ error: "Please provide the muscle group ID." })

  try {
    const groupMuscle = await prisma.groupMuscle.findUnique({ where: { id } });

    if (!groupMuscle) return reply.status(404).send({ message: "Group muscle not found." });

    return reply.status(200).send(groupMuscle);
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to fetch group muscle." });
  }
}

const deleteGroupMuscle = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  if (!id) return reply.status(400).send({ error: "Please provide the muscle group ID." })

  try {
    // Verificar se o grupo muscular existe
    const groupMuscle = await prisma.groupMuscle.findUnique({ where: { id } });
    if (!groupMuscle) {
      return reply.status(404).send({ error: "Group muscle not found." });
    }

    // Buscar todos os exercícios do grupo muscular
    const exercises = await prisma.exercise.findMany({
      where: { groupMuscleId: id },
      select: { id: true }
    });

    // Deletar todos os exercícios dos treinos que usam exercícios deste grupo
    if (exercises.length > 0) {
      const exerciseIds = exercises.map(e => e.id);
      await prisma.exercisesInWorkout.deleteMany({
        where: { exerciseId: { in: exerciseIds } }
      });
    }

    // Deletar todos os exercícios do grupo muscular
    await prisma.exercise.deleteMany({
      where: { groupMuscleId: id }
    });

    // Deletar o grupo muscular
    await prisma.groupMuscle.delete({ where: { id } });

    return reply.status(200).send({ message: "Group muscle deleted successfully!" });
  } catch (error) {
    console.error("Error deleting group muscle:", error);
    return reply.status(500).send({ error, message: "Unable to delete the group muscle. An error occurred." });
  }
}

export { createGroupMuscle, getAllGroupMuscles, getGroupMuscleById, updateGroupMuscle, deleteGroupMuscle }
