import { PrismaClient } from '@prisma/client';
import { Member } from 'src/domain/member/member';
import { Pair } from 'src/domain/team/pair';
import { Team } from 'src/domain/team/team';
import { ITeamRepository } from 'src/domain/team/team-repository-interface';

export class TeamRepository implements ITeamRepository {
  private prismaClient: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<Team[] | null> {
    const allTeam = await this.prismaClient.team.findMany({
      include: {
        pairs: {
          include: {
            PairOnMember: true,
          },
        },
      },
    });

    return null;
  }

  public async getById(id: string): Promise<Team | null> {
    const team = await this.prismaClient.team.findUnique({
      where: {
        id: id,
      },
      include: {
        pairs: {
          include: {
            PairOnMember: {
              include: {
                member: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!team) {
      return null;
    }

    return new Team({
      id: team.id,
      name: team.name,
      pairList: [],
    });
  }
}
