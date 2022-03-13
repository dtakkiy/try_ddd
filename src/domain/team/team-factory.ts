import { Identifier } from 'src/__share__/identifier';
import { Pair } from './pair';
import { Team } from './team';

interface IProps {
  id: string;
  name: string;
  pairList: Pair[];
}

export class TeamFactory {
  public static execute = (props: IProps): Team => {
    const { name, pairList } = props;

    const id = Identifier.generator();
    return Team.create({ id, name, pairList });
  };
}
