import { IMemberRepository } from '../repository-interface/member-repository-interface';

export class MemberSameEmailExist {
  private readonly repository: IMemberRepository;
  private readonly email: string;

  constructor(email: string, repository: IMemberRepository) {
    this.repository = repository;
    this.email = email;
  }

  public async execute(): Promise<boolean> {
    const memberAll = await this.repository.getAll();
    return memberAll.some((member) => member.email.getEmail() === this.email);
  }
}
