import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from "../lib/prisma.js";
import type { Workout } from "../types/workout.js";
import { workoutSchema } from '../schemas/workoutSchema.js';

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
            exercise: true
          }
        }
      }
    });

    return workout;
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to create workout." });
  }
}

const getAllWorkouts = async (_request: FastifyRequest, reply: FastifyReply) => {
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

const getWorkoutById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  if (!id) return reply.status(400).send({ error: "Please provide the workout ID." })

  try {
    const workout = await prisma.workout.findUnique({
      where: { id },

      include: {
        ExercisesInWorkout: {
          include: {
            exercise: true
          }
        }
      }
    });

    if (!workout) return reply.status(404).send({ message: "Workout not found." });

    return reply.status(200).send(workout);
  } catch (error) {
    return reply.status(500).send({ error, message: "Unable to fetch workout." });
  }
}

const updateWorkout = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  if (!id) return reply.status(400).send({ error: "Please provide workout ID." })

  const validateWorkoutInformations = workoutSchema.partial().safeParse(request.body as Workout);
  if (!validateWorkoutInformations.success) return reply.status(400).send({ error: "Invalid workout informations." })

  const { title, description, day, exercisesInWorkout } = validateWorkoutInformations.data;

  const updateData: any = {};

  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (day) updateData.day = day;

  // if (exercisesInWorkout) {
  //   updateData.ExercisesInWorkout = {
  //     deleteMany: {},

  //     create: exercisesInWorkout.map(ex => ({
  //       series: ex.series,
  //       reps: ex.reps,
  //       exercise: {
  //         connect: { id: ex.exerciseId }
  //       }
  //     }))
  //   };
  // }

  try {
    const updated = await prisma.workout.update({
      where: { id },
      data: updateData
    });

    return updated;
  } catch (error) {
    return reply.status(404).send({ error, message: "Unable to update the workout. It may not exist." });
  }
}

const deleteWorkout = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  if (!id) return reply.status(400).send({ error: "Please provide the workout ID." })

  try {
    await prisma.workout.delete({ where: { id } });

    return reply.status(200).send({ message: "Workout deleted successfully!" });
  } catch (error) {
    return reply.status(404).send({ error, message: "Unable to delete the workout. An error occurred." });
  }
}

const deleteExerciseFromWorkout = async (request: FastifyRequest, reply: FastifyReply) => {
  const { exerciseInWorkoutId } = request.params as { exerciseInWorkoutId: string };

  if (!exerciseInWorkoutId) {
    return reply.status(400).send({ error: "ExerciseInWorkout ID must be provided." });
  }

  try {
    await prisma.exercisesInWorkout.delete({
      where: { id: exerciseInWorkoutId }
    });

    return reply.status(200).send({ message: "Exercise removed from workout." });
  } catch (error) {
    return reply.status(404).send({ error, message: "Unable to delete exercise from workout." });
  }
};

export { createWorkout, getAllWorkouts, getWorkoutById, updateWorkout, deleteWorkout, deleteExerciseFromWorkout }
