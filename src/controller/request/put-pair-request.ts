import { ApiProperty } from '@nestjs/swagger';

export class PutPairRequest {
  @ApiProperty()
  readonly name!: string;
  readonly memberId!: string;
}
