import { Member } from 'src/domain/member/member';
import { MemberFactory } from 'src/domain/member/member-factory';
import { MemberRepository } from 'src/infra/db/repository/member-repository';

interface Params {
  name: string;
  email: string;
}

export class CreateMemberUseCase {
  private readonly memberRepository;
  public constructor(memberRepository: MemberRepository) {
    this.memberRepository = memberRepository;
  }

  public async execute(params: Params): Promise<Member> {
    const { name, email } = params;

    // emailに重複が無いかチェック

    // メンバー作成
    const member = MemberFactory.execute({
      name: name,
      email: email,
    });
    this.memberRepository.save(member);

    // Progress作成

    // Teamに紐付け

    return member;
  }
}
