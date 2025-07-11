import { Activity } from "@prisma/client";
import { CreateActivityDTO } from "../../dtos/activity";

export abstract class ActivityRepository {
  abstract create(createActivityDto: CreateActivityDTO, admin_id: string): Promise<Activity | null>;
  abstract findByUrl(url: string): Promise<Activity | null>;
  abstract findAllActivitiesPaginated(skip: number, pageSize: number): Promise<Activity[] | null>;
  abstract countAllActivites(): Promise<number>;
}