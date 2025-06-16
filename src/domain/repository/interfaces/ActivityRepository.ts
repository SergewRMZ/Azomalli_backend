import { Activity } from "@prisma/client";
import { CreateActivityDTO } from "../../dtos/activity";

export abstract class ActivityRepository {
  abstract create(createActivityDto: CreateActivityDTO): Promise<Activity | null>;
  abstract findByUrl(url: string): Promise<Activity | null>;
}