import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const categoryAllAction = async () => {
  try {
    const data = await prisma.category.findMany();
    return data;
  } catch (err: any) {
    console.error("Error fetching categories: ", err);
    throw new Error("Error fetching categories");
  }
};
