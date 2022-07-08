import { Identifier } from 'src/__shared__/identifier';
import { MemberSameEmailExist } from 'src/domain/domain-service/member-same-email-exist';
import { ProgressFactory } from 'src/domain/domain-service/progress-factory';
import { Member } from 'src/domain/member';
import { MemberEmailVO } from 'src/domain/member-email-vo';
import { MemberNameVO } from 'src/domain/member-name-vo';
import { MemberStatusVO } from 'src/domain/member-status-vo';
import { IMemberRepository } from 'src/domain/repository-interface/member-repository-interface';
import { IProgressRepository } from 'src/domain/repository-interface/progress-repository-interface';
import { ITaskRepository } from 'src/domain/repository-interface/task-repository-interface';

interface Params {
  name: string;
  email: string;
}

export class CreateMemberUseCase {
  public constructor(
    private readonly memberRepository: IMemberRepository,
    private readonly progressRepository: IProgressRepository,
    private readonly taskRepository: ITaskRepository
  ) {
    this.memberRepository = memberRepository;
    this.progressRepository = progressRepository;
    this.taskRepository = taskRepository;
  }

  public async execute(params: Params): Promise<Member> {
    const { name, email } = params;

    const memberSameEmailExist = new MemberSameEmailExist(
      email,
      this.memberRepository
    );

    const result = await memberSameEmailExist.execute();
    if (result) {
      throw new Error(`duplicate email. ${email}`);
    }

    const member = Member.create({
      id: Identifier.generator(),
      name: new MemberNameVO(name),
      email: new MemberEmailVO(email),
      status: MemberStatusVO.create(),
    });

    if (member.isFailure()) {
      throw new Error('cannot make member entity.');
    }

    const taskList = await this.taskRepository.getAll();

    const progress = ProgressFactory.execute({
      member: member.value,
      taskList: taskList,
    });

    if (progress === null) {
      throw new Error('task does not exist.');
    }

    await this.memberRepository.create(member.value);
    await this.progressRepository.create(progress);

    return member.value;
  }
}
