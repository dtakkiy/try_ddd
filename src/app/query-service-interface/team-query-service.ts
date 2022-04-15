export class TeamDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly pair: any;

  constructor(props: { id: string; name: string; pair: any }) {
    this.id = props.id;
    this.name = props.name;
    this.pair = props.pair;
  }
}

export interface ITeamQueryService {
  getAll(): Promise<TeamDTO[]>;
}
