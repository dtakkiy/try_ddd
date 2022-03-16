import { PrismaClient } from '@prisma/client';
import { Member } from 'src/domain/member/member';
import { MemberFactory } from 'src/domain/member/member-factory';
import { IMemberRepository } from 'src/domain/member/member-repository-interface';
import {
  MemberStatus,
  MemberStatusType,
} from 'src/domain/member/member-status';

export class MemberRepository implements IMemberRepository {
  private prismaClient: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getById(id: string): Promise<Member | null> {
    const member = await this.prismaClient.member.findUnique({
      where: {
        id: id,
      },
    });

    if (!member) {
      return null;
    }

    const status = new MemberStatus({
      status: member.status,
    });

    return new Member({
      id: member?.id,
      name: member?.name,
      email: member?.email,
      status: status,
    });
  }

  public async getAll(): Promise<Member[]> {
    const allMember = await this.prismaClient.member.findMany({
      include: {
        MemberOnTask: {
          include: { task: true },
        },
      },
    });

    return allMember.map((memberDM) =>
      MemberFactory.execute({
        id: memberDM.id,
        name: memberDM.name,
        email: memberDM.email,
        status: memberDM.status,
      })
    );
  }

  public async update(member: Member): Promise<Member> {
    const { id, name, email } = member;
    const status = member.status.props.status;

    await this.prismaClient.member.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        status,
      },
    });

    return member;
  }

  public async create(member: Member): Promise<Member> {
    await this.prismaClient.member.upsert({
      where: {
        id: member.id,
      },
      update: {
        name: member.id,
        email: member.email,
      },
      create: {
        id: member.id,
        name: member.name,
        email: member.email,
        status: MemberStatusType.active,
      },
    });

    return member;
  }
}
