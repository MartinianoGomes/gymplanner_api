import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from "../lib/prisma.js";
import type { GroupMuscle } from "../types/groupMuscle.js";

const createGroupMuscle = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { name, description } = request.body as GroupMuscle;

    const gm = await prisma.groupMuscle.create({
      data: { name, description }
    });

    return reply.status(201).send(gm);
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to create group muscle." });
  }
}

const getAllGroupMuscles = async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    const gms = await prisma.groupMuscle.findMany();
    return reply.status(200).send(gms);
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to fetch group muscles." });
  }
}

const getGroupMuscleById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const gm = await prisma.groupMuscle.findUnique({ where: { id } });
    if (!gm) return reply.status(404).send({ message: "Group muscle not found." });
    return reply.status(200).send(gm);
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to fetch group muscle." });
  }
}

const updateGroupMuscle = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const { name, description } = request.body as GroupMuscle;

    const updated = await prisma.groupMuscle.update({
      where: { id },
      data: { name, description }
    });

    return reply.status(200).send(updated);
  } catch (error) {
    return reply.status(404).send({ error, message: "Unable to update the group muscle. It may not exist." });
  }
}

const deleteGroupMuscle = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    await prisma.groupMuscle.delete({ where: { id }});
    return reply.status(200).send({ message: "Group muscle deleted successfully!" });
  } catch (error) {
    return reply.status(404).send({ error, message: "Unable to delete the group muscle. An error occurred." });
  }
}

export { createGroupMuscle, getAllGroupMuscles, getGroupMuscleById, updateGroupMuscle, deleteGroupMuscle }
