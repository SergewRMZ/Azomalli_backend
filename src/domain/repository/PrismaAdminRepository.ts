import { PrismaClient } from '@prisma/client';
import { Admin } from '@prisma/client';
import { AdminRepository } from './interfaces/AdminRepository';
import { AdminRegisterDto } from '../dtos/auth';

export class PrismaAdminRepository implements AdminRepository {
  private prisma = new PrismaClient();

  async findByEmail(email: string):Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });
    return admin;
  }

  async create(adminRegisterDto: AdminRegisterDto):Promise<Admin | null> {
    const createAdmin = await this.prisma.admin.create({
      data: {
        name: adminRegisterDto.name,
        email: adminRegisterDto.email,
        password: adminRegisterDto.password,
        created_at: adminRegisterDto.created_at
      },
    });
    return createAdmin;
  }

  async updateEmailValidate(email: string, updateData: Partial<Admin>): Promise<Admin | null> {
    try {
      const updatedUser = await this.prisma.admin.update({
        where: { email },
        data: updateData,
      });
      return updatedUser;
    } catch (error) {
      console.error('Error updating account:', error);
      return null;
    }
  }
}