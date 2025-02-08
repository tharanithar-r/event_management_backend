import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getEventbyIdAction = async (eventId: string) => {
  try {
    await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
  } catch (err) {
    console.error("Error getting event: ", err);
    throw new Error("Error getting event");
  }
};
