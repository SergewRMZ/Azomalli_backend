export class CreateChallengeDTO {
  constructor(
    public readonly user_id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly completed: boolean = false,
    public readonly created_at: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateChallengeDTO?] {
    const {title, description, user_id } = object;

    if(!user_id) {
      return ['El ID de usuario es obligatorio'];
    }

    if (typeof title !== 'string' || title.trim() === '') {
      return ['El campo "title" es obligatorio y debe ser un string no vacío'];
    }

    if (typeof description !== 'string' || description.trim() === '') {
      return ['El campo "description" es obligatorio y debe ser un string no vacío'];
    }

    const completed = false;
    const createdAt = new Date().toISOString();
    return [undefined, new CreateChallengeDTO(user_id, title.trim(), description.trim(), completed, createdAt)];
  }
}
