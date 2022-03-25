import { ApiProperty } from '@nestjs/swagger';

export class PutTaskRequest {
  @ApiProperty()
  readonly memberId!: string;
}
