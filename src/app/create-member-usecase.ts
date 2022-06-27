import { MemberFactory } from 'src/domain/domain-service/member-factory';
import { MemberSameEmailExist } from 'src/domain/domain-service/member-same-email-exist';
import { ProgressFactory } from 'src/domain/domain-service/progress-factory';
import { Member } from 'src/domain/member';
import { IMemberRepository } from 'src/domain/repository-interface/member-repository-interface';
import { IProgressRepository } from 'src/domain/repository-interface/progress-repository-interface';
import { ITaskRepository } from 'src/domain/repository-interface/task-repository-interface';

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

    const result = await memberSameEmailExist.execute();
    if (result) {
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
