import { PrismaClient } from '@prisma/client';
import {
  TeamDTO,
  ITeamQueryService,
} from 'src/app/query-service-interface/team-query-service';

export class TeamQueryService implements ITeamQueryService {
  public constructor(private readonly prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<TeamDTO[]> {
    const allTeams = await this.prismaClient.team.findMany({
      include: {
        pairs: {
          select: {
            id: true,
          },
        },
      },
    });

    const teamList: TeamDTO[] = allTeams.map((teamDM) => {
      return {
        id: teamDM.id,
        name: teamDM.name,
        pair: teamDM.pairs.map((pair) => pair.id),
      };
    });

    return teamList;
  }
}
