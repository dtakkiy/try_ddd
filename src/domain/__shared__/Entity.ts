import { Identifier } from 'src/__shared__/identifier';
export abstract class Entity<T> {
  protected props: { id: Identifier } & T;

  public constructor(props: T, id?: Identifier) {
    this.props = {
      id: id ?? new Identifier(),
      ...props,
    };
  }

  public get id(): Identifier {
    return this.props.id;
  }

  abstract equals(object: Entity<T>): boolean;
}
