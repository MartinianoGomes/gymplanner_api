import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from "../lib/prisma.js";
import type { Workout } from "../types/workout.js";
import { workoutSchema } from '../schemas/workoutSchema.js';
import { addExercise, removeExercise } from '../services/workoutService.js';

const createWorkout = async (request: FastifyRequest, reply: FastifyReply) => {
  const validateWorkoutInformations = workoutSchema.safeParse(request.body as Workout);
  if (!validateWorkoutInformations.success) return reply.status(400).send({ error: "Invalid workout informations." });

  const { title, description, day, userId, exercisesInWorkout } = validateWorkoutInformations.data;

  try {
    const workout = await prisma.workout.create({
      data: {
        title: title,
        description: description,
        day: day,
        userId: userId,
        ExercisesInWorkout: {
          create: exercisesInWorkout.map(exercise => ({
            series: exercise.series,
            reps: exercise.reps,
            exercise: {
              connect: {
                id: exercise.exerciseId
              }
            }
          }))
        }
      },
      include: {
        ExercisesInWorkout: {
          include: {
            exercise: {
              include: {
                groupMuscle: true
              }
            }
          }
        }
      }
    });

    return workout;
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to create workout." });
  }
}

const getMyWorkouts = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user?.userId;

  try {
    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: {
        ExercisesInWorkout: {
          include: {
            exercise: {
              include: {
                groupMuscle: true
              }
            }
          }
        }
      }
    });

    return workouts;
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to fetch workouts." });
  }
}

const getWorkoutById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const userId = request.user?.userId;

  if (!id) return reply.status(400).send({ error: "Please provide the workout ID." })

  try {
    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        ExercisesInWorkout: {
          include: {
            exercise: {
              include: {
                groupMuscle: true
              }
            }
          }
        }
      }
    });

    if (!workout) return reply.status(404).send({ message: "Workout not found." });

    if (workout.userId !== userId) {
      return reply.status(403).send({ error: "Access denied. This workout belongs to another user." });
    }

    return reply.status(200).send(workout);
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to fetch workout." });
  }
}

const updateWorkout = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const userId = request.user?.userId;

  if (!id) return reply.status(400).send({ error: "Please provide workout ID." })

  const validateWorkoutInformations = workoutSchema.partial().safeParse(request.body as Workout);
  if (!validateWorkoutInformations.success) return reply.status(400).send({ error: "Invalid workout informations." })

  const { title, description, day, exercisesInWorkout } = validateWorkoutInformations.data;

  try {
    const existingWorkout = await prisma.workout.findUnique({ where: { id } });

    if (!existingWorkout) {
      return reply.status(404).send({ message: "Workout not found." });
    }

    if (existingWorkout.userId !== userId) {
      return reply.status(403).send({ error: "Access denied. This workout belongs to another user." });
    }

    const updateData: any = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (day) updateData.day = day;

    const updated = await prisma.workout.update({
      where: { id },
      data: updateData
    });

    return updated;
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to update the workout." });
  }
}

const deleteWorkout = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const userId = request.user?.userId;

  if (!id) return reply.status(400).send({ error: "Please provide the workout ID." })

  try {
    const existingWorkout = await prisma.workout.findUnique({ where: { id } });

    if (!existingWorkout) {
      return reply.status(404).send({ message: "Workout not found." });
    }

    if (existingWorkout.userId !== userId) {
      return reply.status(403).send({ error: "Access denied. This workout belongs to another user." });
    }

    // Primeiro, deletar todos os exercícios vinculados ao treino
    await prisma.exercisesInWorkout.deleteMany({ where: { workoutId: id } });

    // Depois, deletar o treino
    await prisma.workout.delete({ where: { id } });

    return reply.status(200).send({ message: "Workout deleted successfully!" });
  } catch (error) {
    console.error("Error deleting workout:", error);
    return reply.status(500).send({ error, message: "Unable to delete the workout. An error occurred." });
  }
}

const addExerciseToWorkout = async (request: FastifyRequest, reply: FastifyReply) => {
  const { workoutId } = request.params as { workoutId: string };
  const { exerciseId, series, reps } = request.body as { exerciseId: string, series: number, reps: number };
  const userId = request.user?.userId;

  if (!workoutId || !exerciseId) {
    return reply.status(400).send({ error: "Workout ID and Exercise ID must be provided." });
  }

  try {
    const existingWorkout = await prisma.workout.findUnique({ where: { id: workoutId } });

    if (!existingWorkout) {
      return reply.status(404).send({ message: "Workout not found." });
    }

    if (existingWorkout.userId !== userId) {
      return reply.status(403).send({ error: "Access denied. This workout belongs to another user." });
    }

    const exerciseInWorkout = await addExercise({
      workoutId,
      exerciseId,
      series,
      reps
    });

    return exerciseInWorkout;
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to add exercise to workout." });
  }
};

const excludeExerciseFromWorkout = async (request: FastifyRequest, reply: FastifyReply) => {
  const { exerciseInWorkoutId } = request.params as { exerciseInWorkoutId: string };
  const userId = request.user?.userId;

  if (!exerciseInWorkoutId) {
    return reply.status(400).send({ error: "ExerciseInWorkout ID must be provided." });
  }

  try {
    const exerciseInWorkout = await prisma.exercisesInWorkout.findUnique({
      where: { id: exerciseInWorkoutId },
      include: { workout: true }
    });

    if (!exerciseInWorkout) {
      return reply.status(404).send({ message: "Exercise in workout not found." });
    }

    if (exerciseInWorkout.workout.userId !== userId) {
      return reply.status(403).send({ error: "Access denied. This workout belongs to another user." });
    }

    await prisma.exercisesInWorkout.delete({
      where: { id: exerciseInWorkoutId }
    });

    return reply.status(200).send({ message: "Exercise removed from workout." });
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to delete exercise from workout." });
  }
};

export { createWorkout, getMyWorkouts, getWorkoutById, updateWorkout, deleteWorkout, excludeExerciseFromWorkout, addExerciseToWorkout }
