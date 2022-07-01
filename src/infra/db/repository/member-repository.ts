import { PrismaClient } from '@prisma/client';
import { Member } from 'src/domain/member';
import { MemberEmailVO } from 'src/domain/member-email-vo';
import { MemberNameVO } from 'src/domain/member-name-vo';
import { MemberStatusVO, MemberStatusType } from 'src/domain/member-status-vo';
import { IMemberRepository } from 'src/domain/repository-interface/member-repository-interface';

export class MemberRepository implements IMemberRepository {
  constructor(private readonly prismaClient: PrismaClient) {
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

    return Member.reconstruct({
      id: member?.id,
      name: new MemberNameVO(member.name),
      email: new MemberEmailVO(member.email),
      status: new MemberStatusVO(member.status),
    });
  }

  public async getByEmail(email: string): Promise<Member | null> {
    const member = await this.prismaClient.member.findFirst({
      where: {
        email: email,
      },
    });

    if (!member) {
      return null;
    }

    return Member.reconstruct({
      id: member.id,
      name: new MemberNameVO(member.name),
      email: new MemberEmailVO(member.email),
      status: new MemberStatusVO(member.status),
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
      Member.reconstruct({
        id: memberDM.id,
        name: new MemberNameVO(memberDM.name),
        email: new MemberEmailVO(memberDM.email),
        status: new MemberStatusVO(memberDM.status),
      })
    );
  }

  public async update(member: Member): Promise<Member> {
    const { id, name, email, status } = member.getAllProperties();

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
    const { id, name, email } = member.getAllProperties();

    await this.prismaClient.member.upsert({
      where: {
        id: id,
      },
      update: {
        name: name,
        email: email,
      },
      create: {
        id: id,
        name: name,
        email: email,
        status: MemberStatusType.active,
      },
    });

    return member;
  }
}
