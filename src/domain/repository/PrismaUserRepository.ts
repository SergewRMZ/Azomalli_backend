import { PrismaClient } from '@prisma/client';
import { User } from '@prisma/client';
import { UserRepository } from './interfaces/UserRepository';
import { UserRegisterDto } from '../dtos/auth/UserRegisterDto';

export class PrismaUserRepository implements UserRepository {
  private prisma = new PrismaClient();

  async findByEmail(email: string):Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findById(user_id: string):Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: user_id
      }
    })

    return user;
  }

  async create(userRegisterDto: UserRegisterDto):Promise<User | null> {
    const createAccount = await this.prisma.user.create({
      data: {
        username: userRegisterDto.username,
        email: userRegisterDto.email,
        password: userRegisterDto.password,
        notifications: userRegisterDto.notifications,
        created_at: new Date(userRegisterDto.created_at)
      },
    });
    return createAccount;
  }

  async updateEmailValidate(email: string, updateData: Partial<User>): Promise<User | null> {
    try {
      const updatedUser = await this.prisma.user.update({
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