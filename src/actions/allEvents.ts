import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const allEventsAction = async (category: string) => {
  try {
    let events;
    if (category === "All") {
      events = await prisma.event.findMany({});
    } else {
      events = await prisma.event.findMany({
        where: {
          category: category,
        },
      });
    }
    return events;
  } catch (err) {
    console.error("Error fetching events: ", err);
    throw new Error("Error fetching events");
  }
};
