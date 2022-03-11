export class SomeData {
  private id: string;
  private required: boolean;
  private number: number;
  public constructor(props: { id: string; required: boolean; number: number }) {
    const { id, required, number } = props;
    this.id = id;
    this.required = required;
    this.number = number;
  }

  public getAllProperties() {
    return {
      id: this.id,
      required: this.required,
      number: this.number,
    };
  }
}
