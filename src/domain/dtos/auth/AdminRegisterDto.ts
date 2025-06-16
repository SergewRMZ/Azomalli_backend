import { regularExps } from "../../../config";

export class AdminRegisterDto {
  private constructor (
    public name: string,
    public email: string,
    public password: string,
    public created_at: string,
  ) {}

  static create (object: {[key: string]: any}): [string?, AdminRegisterDto?] {
    const {name, email, password} = object;
    if(!name) return['Missing Username', undefined];
    if (!email) return ['Missing email', undefined];
    if (!password) return ['Missing password', undefined];
    if (!regularExps.email.test(email)) return ['El correo no es válido', undefined];
    if (!regularExps.password.test(password)) return ['La contraseña debe contener por lo menos un número, una mayúscula, una minúscula y un carácter especial', undefined];
    const createdAt = new Date().toISOString();
    return [undefined, new AdminRegisterDto(name, email, password, createdAt)];
  }
}