import { PrismaClient } from '@prisma/client';
import { Identifier } from 'src/__shared__/identifier';
import { Member } from '../member';
import { Team } from '../team';

interface Props {
  team: Team;
  member: Member;
}

export class TeamMemberUpdate {
  constructor(private readonly prismaClient: PrismaClient) {}

  public async update(props: Props) {
    const memberUpdateQuery = this.makeQueryMemberUpdate(props.member);
    const teamUpdateQuery = this.makeQueryTeamUpdate(props.team);

    const query: any[] = [];

    query.push(memberUpdateQuery);
    teamUpdateQuery.map((updateQuery) => {
      query.push(updateQuery);
    });

    try {
      await this.prismaClient.$transaction(query);
    } catch (e) {
      throw new Error('failed to update team.');
    } finally {
      this.prismaClient.$disconnect();
    }
  }

  private makeQueryTeamUpdate(team: Team) {
    const query: any[] = [];

    const { id, name, pairList } = team.getAllProperties();

    const teamUpdateQuery = this.prismaClient.team.upsert({
      where: {
        id: id,
      },
      update: {
        id: id,
        name: name,
      },
      create: {
        id: Identifier.generator(),
        name: name,
      },
    });

    const pairUpdateQuery = team.getPairList().map((pair) => {
      const { id, name } = pair.getAllProperties();

      return this.prismaClient.pair.upsert({
        where: {
          id: id,
        },
        update: {
          name: name,
          teamId: team.id,
        },
        create: {
          id: id,
          name: name,
          teamId: team.id,
        },
      });
    });

    const memberUpdateQuery = pairList.map((pair) => {
      pair.getAllProperties().memberIdList.map((memberId) => {
        return this.prismaClient.member.update({
          where: {
            id: memberId,
          },
          data: {
            pairId: pair.id,
          },
        });
      });
    });

    // 生成したクエリを配列に追加
    query.push(teamUpdateQuery);
    pairUpdateQuery.map((pairQuery) => {
      query.push(pairQuery);
    });
    memberUpdateQuery.map((memberQuery) => {
      query.push(memberQuery);
    });

    return query;
  }

  private makeQueryMemberUpdate(member: Member) {
    const { id, name, email, status } = member.getAllProperties();
    const memberUpdateQuery = this.prismaClient.member.upsert({
      where: {
        id: id,
      },
      update: {
        id: id,
        name: name,
        email: email,
        status: status,
      },
      create: {
        id: Identifier.generator(),
        name: name,
        email: email,
        status: status,
      },
    });

    return memberUpdateQuery;
  }
}
