import { ApiProperty } from '@nestjs/swagger';

export class PutMemberRequest {
  @ApiProperty()
  readonly status!: string;
}
