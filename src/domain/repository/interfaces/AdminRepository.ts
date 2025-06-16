import { Admin } from '@prisma/client';
import { AdminRegisterDto } from '../../dtos/auth';

export abstract class AdminRepository {
  abstract findByEmail(email: string): Promise<Admin | null>;
  abstract create(accountRegisterDto: AdminRegisterDto): Promise<Admin | null>;
  abstract updateEmailValidate(email: string, updateData: Partial<Admin>): Promise<Admin | null>;
}