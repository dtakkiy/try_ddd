import { ApiProperty } from '@nestjs/swagger';
import { MemberDTO } from 'src/app/member/query-service-interface/member-query-service';
export class GetMemberResponse {
  @ApiProperty({ type: () => [MemberData] })
  memberData: MemberData[];

  public constructor(params: { memberDatas: MemberDTO[] }) {
    const { memberDatas } = params;
    this.memberData = memberDatas.map(
      ({ id, name, email, status, pair, team }) => {
        return new MemberData({
          id,
          name,
          email,
          status,
          pair,
          team,
        });
      }
    );
  }
}

class MemberData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  pair: any;

  @ApiProperty()
  team: any;

  public constructor(params: {
    id: string;
    name: string;
    status: string;
    email: string;
    pair: any;
    team: any;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.status = params.status;
    this.pair = params.pair;
    this.team = params.team;
  }
}
