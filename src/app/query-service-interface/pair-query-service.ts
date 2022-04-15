export class PairDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly members: any;

  constructor(props: { id: string; name: string; members: any }) {
    this.id = props.id;
    this.name = props.name;
    this.members = props.members;
  }
}

export interface IPairQueryService {
  getAll(): Promise<PairDTO[]>;
}
