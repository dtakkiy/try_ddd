import { Member } from './member';

export interface IMemberRepository {
  getAll(): Promise<Member[]>;
  update(member: Member): Promise<void>;
  save(member: Member): Promise<Member>;
  getById(id: string): Promise<Member | null>;
}
