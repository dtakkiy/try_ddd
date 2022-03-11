import { ApiProperty } from '@nestjs/swagger';
import { SomeDataDTO } from 'src/app/sample/query-service-interface/some-data-qs';

export class GetSomeDataResponse {
  @ApiProperty({ type: () => [SomeData] })
  someData: SomeData[];

  public constructor(params: { someDatas: SomeDataDTO[] }) {
    const { someDatas } = params;
    this.someData = someDatas.map(({ id, required, number }) => {
      return new SomeData({
        id,
        required,
        number,
      });
    });
  }
}

class SomeData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  required: boolean;

  @ApiProperty()
  number: number;

  public constructor(params: {
    id: string;
    required: boolean;
    number: number;
  }) {
    this.id = params.id;
    this.required = params.required;
    this.number = params.number;
  }
}
