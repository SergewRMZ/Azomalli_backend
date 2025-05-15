import { regularExps } from "../../../config";

export class UserRegisterDto {
  private constructor (
    public email: string,
    public password: string,
    public created_at: string
  ) {}

  static create (object: {[key: string]: any}): [string?, UserRegisterDto?] {
    const {email, password} = object;
    if (!email) return ['Missing email', undefined];
    if (!password) return ['Missing password', undefined];
    
    if (!regularExps.email.test(email)) return ['El correo no es válido', undefined];
    if (!regularExps.password.test(password)) return ['La contraseña debe contener por lo menos un número, una mayúscula, una minúscula y un carácter especial', undefined];
    const createdAt = new Date().toISOString();
    return [undefined, new UserRegisterDto(email, password, createdAt)];
  }
}