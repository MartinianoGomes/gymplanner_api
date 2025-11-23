import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export const prisma = globalForPrisma.prisma || new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;