import { TeamNameVO } from '../team-name-vo';

describe('team-name-voのテスト', () => {
  it('インスタンスが生成できる', () => {
    expect(new TeamNameVO('1')).toBeInstanceOf(TeamNameVO);
  });

  it('不正なチーム名の場合', () => {
    expect(() => new TeamNameVO('a')).toThrowError();
  });
});
