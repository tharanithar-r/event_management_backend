import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteEventAction = async (eventId: string) => {
  try {
    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });
  } catch (err) {
    console.error("Error deleting event: ", err);
    throw new Error("Error deleting event");
  }
};
