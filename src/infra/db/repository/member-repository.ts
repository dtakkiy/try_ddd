import { PrismaClient } from '@prisma/client';
import { Member } from 'src/domain/member/member';
import { MemberEmailVO } from 'src/domain/member/member-email-vo';
import { MemberFactory } from 'src/domain/member/member-factory';
import { MemberNameVO } from 'src/domain/member/member-name-vo';
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

    const name = new MemberNameVO(member.name);
    const email = new MemberEmailVO(member.email);
    const status = new MemberStatus(member.status);

    return new Member({
      id: member?.id,
      name: name,
      email: email,
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
    const { id } = member;
    const name = member.name.getValue();
    const email = member.email.getEmail();
    const status = member.status.getStatus();

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
        email: member.email.getEmail(),
      },
      create: {
        id: member.id,
        name: member.name.getValue(),
        email: member.email.getEmail(),
        status: MemberStatusType.active,
      },
    });

    return member;
  }
}
