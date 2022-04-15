import { PrismaClient } from '@prisma/client';
import { Member } from 'src/domain/member';
import { MemberEmailVO } from 'src/domain/member-email-vo';
import { MemberFactory } from 'src/domain/domain-service/member-factory';
import { MemberNameVO } from 'src/domain/member-name-vo';
import { IMemberRepository } from 'src/domain/repository-interface/member-repository-interface';
import { MemberStatusVO, MemberStatusType } from 'src/domain/member-status-vo';

export class MemberRepository implements IMemberRepository {
  private readonly prismaClient: PrismaClient;
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
    const status = new MemberStatusVO(member.status);

    return new Member({
      id: member?.id,
      name: name,
      email: email,
      status: status,
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

    return new Member({
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
