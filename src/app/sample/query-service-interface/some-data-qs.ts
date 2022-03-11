export class SomeDataDTO {
  public readonly id: string;
  public readonly required: boolean;
  public readonly number: number;
  public constructor(props: { id: string; required: boolean; number: number }) {
    const { id, required, number } = props;
    this.id = id;
    this.required = required;
    this.number = number;
  }
}

export interface ISomeDataQS {
  getAll(): Promise<SomeDataDTO[]>;
}
