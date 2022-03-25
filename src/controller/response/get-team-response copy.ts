import { ApiProperty } from '@nestjs/swagger';
import { TeamDTO } from 'src/app/query-service-interface/team-query-service';
export class GetTeamResponse {
  @ApiProperty({ type: () => [TeamData] })
  teamData: TeamData[];

  public constructor(params: { teamDatas: TeamDTO[] }) {
    const { teamDatas } = params;
    this.teamData = teamDatas.map(({ id, name, pair }) => {
      return new TeamData({
        id,
        name,
        pair,
      });
    });
  }
}

class TeamData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  pair: any;

  public constructor(params: { id: string; name: string; pair: any }) {
    this.id = params.id;
    this.name = params.name;
    this.pair = params.pair;
  }
}
