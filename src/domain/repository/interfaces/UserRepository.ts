import { User } from '@prisma/client';
import { UserRegisterDto } from '../../dtos/auth/UserRegisterDto';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(accountRegisterDto: UserRegisterDto): Promise<User | null>;
  abstract updateEmailValidate(email: string, updateData: Partial<User>): Promise<User | null>;
}