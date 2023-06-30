import { prisma } from "~/db.server";
import type { Cate } from "@prisma/client";

export async function getCates(): Promise<Cate[]> {
  return prisma.cate.findMany({
    include: {
      posts: true,
    },
  });
}
