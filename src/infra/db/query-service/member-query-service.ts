import { PrismaClient } from '@prisma/client';
import {
  MemberDTO,
  IMemberQueryService,
} from 'src/app/query-service-interface/member-query-service';

export class MemberQueryService implements IMemberQueryService {
  private prismaClient: PrismaClient;
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<MemberDTO[]> {
    const allMembers = await this.prismaClient.member.findMany({
      include: {
        pair: {
          include: {
            team: true,
          },
        },
      },
    });

    const memberList: MemberDTO[] = allMembers.map((memberDM) => {
      let teamId = null;
      let pairId = null;
      teamId = memberDM.pair?.id;
      pairId = memberDM.pair?.teamId;
      const { id, name, email, status } = memberDM;
      return { id, name, email, status, pair: pairId, team: teamId };
    });

    return memberList;
  }
}
