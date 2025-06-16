export class CreateActivityDTO {
  constructor(
    public readonly emotions: string[],
    public readonly title: string,
    public readonly url: string,
    public readonly description: string
  ) {}

  static create (object: {[key: string]: any}): [string?, CreateActivityDTO?] {
    const { emotions, title, url, description } = object;
    if(!Array.isArray(emotions) || emotions.length === 0) {
      return ['El campo "emotions" debe de ser un campo no vacío'];
    }

    if(typeof title !== 'string' || title === '') {
      return ['El campo title es obligatorio'];
    }

    if(!url.startsWith('https://')) {
      return ['El campo de URL debe de ser un enlace válido'];
    }
    return [undefined, new CreateActivityDTO(emotions, title, url, description)];
  }
}