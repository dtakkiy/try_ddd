import { TeamNameVO } from '../team/team-name-vo';

describe('team-name-voのテスト', () => {
  it('インスタンスが生成できる', () => {
    expect(new TeamNameVO('1')).toBeInstanceOf(TeamNameVO);
  });

  it('不正なチーム名の場合', () => {
    expect(() => new TeamNameVO('a')).toThrowError();
  });

  it('チーム名が変更できる', () => {
    const teamName = new TeamNameVO('1');
    expect(teamName.getValue()).toMatch(/1/);

    teamName.setValue('2');
    expect(teamName.getValue()).toMatch(/2/);
  });
});
