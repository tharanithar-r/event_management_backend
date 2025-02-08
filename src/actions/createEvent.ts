import { EventStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface EventInput {
  title: string;
  description: string;
  date: Date;
  endDate: Date;
  category: string;
  imageUrl?: string;
  status?: EventStatus;
  location?: string;
  creatorId: string;
  maxAttendees?: number;
  isPublic?: boolean;
}

export const newEvent = async (data: EventInput) => {
  try {
    console.log("Received complete data in newEvent:", data);
    const userid = await prisma.user.findUnique({
      where: {
        username: data.creatorId,
      },
      select: {
        id: true,
      },
    });

    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        endDate: data.endDate,
        category: data.category,
        imageUrl: data.imageUrl,
        status: data.status || "UPCOMING",
        location: data.location,
        creatorId: userid.id,
        maxAttendees: data.maxAttendees || 100,
        isPublic: data.isPublic ?? true,
        isCancelled: false,
      },
    });
  } catch (err) {
    console.error("Error creating event: ", err);
    throw new Error("Error creating event");
  }
};
