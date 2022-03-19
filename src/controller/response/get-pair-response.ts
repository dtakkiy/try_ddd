import { ApiProperty } from '@nestjs/swagger';
import { PairDTO } from 'src/app/query-service-interface/pair-query-service';
export class GetPairResponse {
  @ApiProperty({ type: () => [PairData] })
  pairData: PairData[];

  public constructor(params: { pairDatas: PairDTO[] }) {
    const { pairDatas } = params;
    this.pairData = pairDatas.map(({ id, name, members }) => {
      return new PairData({
        id,
        name,
        members,
      });
    });
  }
}

class PairData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  members: any;

  public constructor(params: { id: string; name: string; members: any }) {
    this.id = params.id;
    this.name = params.name;
    this.members = params.members;
  }
}
