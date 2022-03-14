import { Member } from 'src/domain/member/member';
import { MemberFactory } from 'src/domain/member/member-factory';
import { IMemberRepository } from 'src/domain/member/member-repository-interface';
import { MemberSameEmailExist } from 'src/domain/member/member-same-email-exist';
import { IProgressRepository } from 'src/domain/progress/progress-repository-interface';
import { ITaskRepository } from 'src/domain/task/task-repository-interface';
import { ProgressFactory } from 'src/domain/progress/progress-factory';

interface Params {
  name: string;
  email: string;
}

export class CreateMemberUseCase {
  private readonly memberRepository;
  private readonly progressRepository;
  private readonly taskRepository;

  public constructor(
    memberRepository: IMemberRepository,
    progressRepository: IProgressRepository,
    taskRepository: ITaskRepository
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

    if (await memberSameEmailExist.execute()) {
      throw new Error(`duplicate email. ${email}`);
    }

    const member = MemberFactory.execute({
      name: name,
      email: email,
    });

    const taskList = await this.taskRepository.getAll();

    const progress = ProgressFactory.execute({
      member: member,
      taskList: taskList,
    });

    if (progress === null) {
      throw new Error('task does not exist.');
    }

    await this.memberRepository.create(member);
    await this.progressRepository.create(progress);

    return member;
  }
}
