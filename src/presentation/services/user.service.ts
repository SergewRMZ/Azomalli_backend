import { bcrypAdapter, envs, JwtAdapter, regularExps } from '../../config';
import { AdminRegisterDto, CustomError, PrismaActivityRepository } from '../../domain';
import { UserLoginDto } from '../../domain/dtos/auth';
import { UserRegisterDto } from '../../domain/dtos/auth';
import { UserEntity } from '../../domain';
import { PrismaAdminRepository } from '../../domain';
import { PrismaUserRepository } from '../../domain';
import { EmailService } from './email.service';

export class UserService {
  constructor(
    private readonly prismaUserRepository: PrismaUserRepository,
    private readonly prismaAdminRepository: PrismaAdminRepository,
    private readonly emailService: EmailService
  ) {}

  public async registerUser(userRegisterDto: UserRegisterDto) {
    const existUser = await this.prismaUserRepository.findByEmail(userRegisterDto.email);
    if(existUser) throw CustomError.badRequest('El correo ya existe');

    try {
      userRegisterDto.password = bcrypAdapter.hash(userRegisterDto.password);
      const user = await this.prismaUserRepository.create(userRegisterDto);

      if(user == null) throw CustomError.internalServer('Internal Server Error');
  
      // Envíar correo de verificación.
      await this.sendEmailValidationLink(user.email);
      const { password, ...rest } = UserEntity.fromObject(user);
      const token = await JwtAdapter.generateToken({ user_id: user.id, email: user.email, role: user.role });
      if(!token) throw CustomError.internalServer('Error while creating JWT');
      return {
        user: rest,
        token: token
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async registerAdmin(adminRegisterDto: AdminRegisterDto) {
    const existAdmin = await this.prismaAdminRepository.findByEmail(adminRegisterDto.email);
    if(existAdmin) throw CustomError.badRequest('El correo electrónico ya está registrado');

    try {
      adminRegisterDto.password = bcrypAdapter.hash(adminRegisterDto.password);
      const admin = await this.prismaAdminRepository.create(adminRegisterDto);

      if(admin == null) throw CustomError.internalServer('Internal server error');

      await this.sendEmailValidationLink(admin.email);
      const { password, ...rest } = admin;
      const token = await JwtAdapter.generateToken({ user_id: admin.id, email: admin.email, role: admin.role });

      if(!token) throw CustomError.internalServer('Error while creating token JWT');
      
      return {
        user: rest,
        token: token
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginAdmin(userLoginDto: UserLoginDto) {
    try {
      const existAdmin = await this.prismaAdminRepository.findByEmail(userLoginDto.email);
      if(!existAdmin) throw CustomError.badRequest('The email does not exist');
      const isMatch = bcrypAdapter.compare(userLoginDto.password, existAdmin.password);
      if(!isMatch) throw CustomError.badRequest('Incorrect Password');
      const { password, ...admin } = existAdmin;

      const token = await JwtAdapter.generateToken({ user_id: admin.id, email: admin.email, role: admin.role });
      if(!token) throw CustomError.internalServer('Error while creating token JWT');

      return {
        account: admin,
        token
      };
    } catch (error) {
      
    }
  }

  public async loginUser(userLoginDto: UserLoginDto) {
    try {
      const existUser = await this.prismaUserRepository.findByEmail(userLoginDto.email);
      if(!existUser) throw CustomError.badRequest('The email does not exist');
      const isMatch = bcrypAdapter.compare(userLoginDto.password, existUser.password);

      if(!isMatch) throw CustomError.badRequest('Incorrect Password');
      const { password, ...user } = UserEntity.fromObject(existUser); 

      const token = await JwtAdapter.generateToken({ user_id: existUser.id, email: existUser.email });
      if(!token) throw CustomError.internalServer('Error while creating JWT');

      return {
        account: user,
        token: token
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if(!token) throw CustomError.internalServer('Error getting token');
    const link = `${envs.WERSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Verifica tu correo electrónico</h1>
      <p>Da click en el siguiente enlace para verificar tu correo electrónico</p>
      <a href="${link}">Valida tu correo</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html
    };

    const isSent = await this.emailService.sendEmail(options);
    if(!isSent) throw CustomError.internalServer('Error sending email');
    return true;
  }

  public validateEmail = async (token:string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized('Invalid Token');
    
    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer('Email not in token');

    const user = await this.prismaUserRepository.findByEmail(email);
    if (!user) throw CustomError.internalServer('User not exists');
    await this.prismaUserRepository.updateEmailValidate(email, { email_validated: true });    
    return true;
  } 
}