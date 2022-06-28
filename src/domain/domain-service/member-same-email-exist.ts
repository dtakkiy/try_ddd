import { IMemberRepository } from '../repository-interface/member-repository-interface';

export class MemberSameEmailExist {
  constructor(
    private readonly email: string,
    private readonly repository: IMemberRepository
  ) {
    this.repository = repository;
    this.email = email;
  }

  public async execute(): Promise<boolean> {
    const memberAll = await this.repository.getAll();
    return memberAll.some((member) => member.email.getEmail() === this.email);
  }
}
