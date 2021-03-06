import { DSError, Failure, Result, Success } from 'src/__shared__/result';
import { IEmailRepository } from 'src/app/repository-interface/email-repository-interface';
import { Member } from '../member';
import { Pair } from '../pair';
import { ITeamRepository } from '../repository-interface/team-repository-interface';
import { Team } from '../team';
import { TeamMemberUpdate } from './team-member-update';
import { TeamService } from './team-service';

export class DeleteMemberFromPair {
  // 管理者宛の送信メール設定値
  TO_EMAIL_ADDRESS = 'admin@example.com';
  FROM_EMAIL_ADDRESS = 'admin@example.com';
  EMAIL_SUBJECT_2_PEOPLE_LESS = 'チームの人数が2名以下です';
  EMAIL_SUBJECT_NO_MERGING_PAIR = '合流するペアが存在しない';

  // ペアの参加者の最小人数
  MIN_MEMBER_NUMBER = 1;

  // チームの参加者が何名になった場合、メール送るか？
  SEND_EMAIL_MEMBER_NUMBER = 2;

  constructor(
    private readonly teamRepository: ITeamRepository,
    private readonly emailRepository: IEmailRepository,
    private readonly teamMemberUpdate: TeamMemberUpdate
  ) {}

  public async execute(member: Member): Promise<Result<Team, DSError>> {
    const joinTeam = await this.teamRepository.getByMemberId(member.id);
    if (joinTeam === null) {
      return new Failure('number of team members could not be retrieved.');
    }

    const joinPair = this.getPairIdByMemberId(joinTeam, member.id);
    if (joinPair === null) {
      return new Failure('pair information could not be retrieved.');
    }

    // ユーザをリストから削除
    joinPair.deleteMember(member.id);
    const joinMemberOfNumber = joinPair.getMemberCount();

    // ペアが1名以下になった場合の処理
    if (joinMemberOfNumber <= this.MIN_MEMBER_NUMBER) {
      // 解散するペアのメンバーを取得する
      const deleteMemberList = await joinPair.getMemberIdList();
      let deleteMemberId = '';

      if (
        typeof deleteMemberList[0] === 'undefined' ||
        deleteMemberList.length < this.MIN_MEMBER_NUMBER
      ) {
        return new Failure(
          'failed to retrieve the member of the pair to be disbanded.'
        );
      } else {
        deleteMemberId = deleteMemberList[0];
      }

      joinTeam.deletePair(joinPair.id);
      // 解散したペアメンバーを同じチームの他のペアに合流させる
      const teamService = new TeamService(this.teamRepository);
      const mergePair = await teamService.getPairFewestNumberOfMember(
        joinTeam.id
      );

      if (mergePair === null) {
        await this.sendMail(
          this.EMAIL_SUBJECT_NO_MERGING_PAIR,
          member,
          joinTeam
        );
        return new Success(joinTeam);
      }

      // あぶれたメンバーをペアに合流させる
      mergePair.addMember(deleteMemberId);

      joinTeam.deletePair(mergePair.id);
      joinTeam.addPair(mergePair);
    } else {
      joinTeam.deletePair(joinPair.id);
      joinTeam.addPair(joinPair);
    }

    await this.teamMemberUpdate.update({
      team: joinTeam,
      member: member,
    });

    // チームが2名以下になった場合の処理
    const joinTeamOfMember = joinTeam.getMemberCount();
    if (joinTeamOfMember <= this.SEND_EMAIL_MEMBER_NUMBER) {
      await this.sendMail(
        this.EMAIL_SUBJECT_2_PEOPLE_LESS,
        member,
        joinTeam,
        joinTeamOfMember - 1
      );
    }

    return new Success(joinTeam);
  }

  private getPairIdByMemberId(team: Team, memberId: string): Pair | null {
    const joinPair = team.getPairList().find((pair) => {
      const result = pair
        .getMemberIdList()
        .filter((MemberId) => MemberId === memberId);
      if (result) {
        return pair;
      }
    });

    if (typeof joinPair === 'undefined') {
      return null;
    }

    return joinPair;
  }

  private async sendMail(
    subject: string,
    member: Member,
    joinTeam: Team,
    joinTeamOfMember?: number
  ) {
    const { id, name } = member.getAllProperties();

    const message = {
      to: this.TO_EMAIL_ADDRESS,
      from: this.FROM_EMAIL_ADDRESS,
      subject: subject,
      html: `減った参加者ID: ${id}, ${name}, どのチーム？: ${joinTeam.getName()} 現在の人数: ${joinTeamOfMember}`,
    };

    await this.emailRepository.sendMail(message);
  }
}
