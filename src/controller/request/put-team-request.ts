import { ApiProperty } from '@nestjs/swagger';

export class PutTeamRequest {
  @ApiProperty()
  readonly name!: string;
  readonly pairId!: string;
}
