// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PostSomeDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly required!: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly number!: number;
}
