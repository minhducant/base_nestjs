import { IsArray, IsMongoId } from 'class-validator';

export class DeleteUsersDto {
  @IsArray()
  @IsMongoId({ each: true }) // Kiểm tra từng phần tử là ObjectId hợp lệ
  readonly ids: string[];
}
