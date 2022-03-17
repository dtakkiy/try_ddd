import { Identifier } from 'src/__share__/identifier';

export abstract class Entity<T> {
  protected readonly _id: string;
  protected props: T;

  public constructor(props: T, id?: string) {
    this._id = id ? id : Identifier.generator();
    this.props = props;
  }

  public get id(): string {
    return this._id;
  }

  public equals = (object?: Entity<T>): boolean => {
    if (object == null || object == undefined) {
      return false;
    }

    return this._id === object?._id;
  };
}
