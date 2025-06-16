export class PaginationDto {
  constructor (
    public readonly page:number,
    public readonly pageSize:number
  ) {}

  static create (page: number = 1, pageSize: number = 10): [string?, PaginationDto?] {
    if (isNaN(page) || isNaN(pageSize)) return ['Page and Limit must be numbers', undefined];
    
    if (page <= 0) return ['Page must be greater than 0', undefined];
    if (pageSize <= 0) return ['Limit must be greater than 0', undefined];
    
    return [undefined, new PaginationDto(page, pageSize)];
  }
}