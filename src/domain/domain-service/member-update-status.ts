import {
  DSError,
  Failure,
  NonError,
  Result,
  Success,
} from 'src/__shared__/result';
import { Member } from '../member';
import { MemberEmailVO } from '../member-email-vo';
import { MemberNameVO } from '../member-name-vo';
import { MemberStatusVO } from '../member-status-vo';
import { IMemberRepository } from '../repository-interface/member-repository-interface';

export class MemberUpdateStatus {
  constructor(private readonly memberRepository: IMemberRepository) {
    this.memberRepository = memberRepository;
  }

  public execute = async (
    member: Member,
    updateStatus: MemberStatusVO
  ): Promise<Result<NonError, DSError>> => {
    const { id, name, email, status } = member.getAllProperties();

    if (updateStatus.isEqual(new MemberStatusVO(status))) {
      return new Failure('status has already been changed.');
    }

    const updateMember = Member.create({
      id: id,
      name: new MemberNameVO(name),
      email: new MemberEmailVO(email),
      status: updateStatus,
    });

    if (updateMember.isFailure()) {
      return new Failure(updateMember.value);
    }

    await this.memberRepository.update(updateMember.value);
    return new Success(null);
  };
}
