export class MemberDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly status: string;
  public pair: any;
  public team: any;

  constructor(props: {
    id: string;
    name: string;
    email: string;
    status: string;
    pair: any;
    team: any;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.status = props.status;
    this.pair = props.pair;
    this.team = props.team;
  }
}

export interface IMemberQueryService {
  getAll(): Promise<MemberDTO[]>;
}
