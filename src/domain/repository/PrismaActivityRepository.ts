import { Activity, PrismaClient } from "@prisma/client";
import { ActivityRepository } from "./interfaces/ActivityRepository";
import { CreateActivityDTO } from "../dtos/activity";

export class PrismaActivityRepository implements ActivityRepository {
  private prisma = new PrismaClient();

  async create(createActivityDto: CreateActivityDTO, admin_id: string): Promise<Activity | null> {
    try {
      const activity = await this.prisma.activity.create({
        data: {
          admin_id,
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

  async findByEmotion(emotion: string): Promise<Activity[]> {
    return await this.prisma.activity.findMany({
      where: {
        emotions: {
          has: emotion
        }
      },
      take: 3,
      orderBy: {
        id: 'asc'
      }
    });
  }

}