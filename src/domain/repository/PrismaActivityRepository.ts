import { Activity, PrismaClient } from "@prisma/client";
import { ActivityRepository } from "./interfaces/ActivityRepository";
import { CreateActivityDTO } from "../dtos/activity";

export class PrismaActivityRepository implements ActivityRepository {
  private prisma = new PrismaClient();

  async create(createActivityDto: CreateActivityDTO): Promise<Activity | null> {
    try {
      const activity = await this.prisma.activity.create({
        data: {
          emotions: createActivityDto.emotions,
          title: createActivityDto.title,
          url: createActivityDto.url,
          description: createActivityDto.description
        }
      });

      return activity;
    } catch (error) {
      return null;
    }
  }

  async findByUrl(url: string): Promise<Activity | null> {
    try {
      const activity = await this.prisma.activity.findFirst({
        where: {url}
      })
      return activity;
    } catch (error) {
      return null;
    }
  }

  async findAllActivitiesPaginated(skip: number, pageSize: number) {
    return await this.prisma.activity.findMany({
      take: pageSize,
      skip
    });
  }

  async countAllActivites(): Promise<number> {
    const count = await this.prisma.activity.count();
    return count;
  }
}