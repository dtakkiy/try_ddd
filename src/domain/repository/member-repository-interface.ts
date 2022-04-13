import { Member } from '../member';

export interface IMemberRepository {
  getAll(): Promise<Member[]>;
  update(member: Member): Promise<Member>;
  create(member: Member): Promise<Member>;
  getById(id: string): Promise<Member | null>;
  getByEmail(email: string): Promise<Member | null>;
}
