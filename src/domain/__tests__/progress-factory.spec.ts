import * as faker from 'faker';
import { Member } from '../member/member';
import { MemberEmailVO } from '../member/member-email-vo';
import { MemberNameVO } from '../member/member-name-vo';
import { MemberStatus } from '../member/member-status';
import { ProgressFactory } from '../progress/progress-factory';
import { Task } from '../task/task';

describe('progress factoryのテスト', () => {
  it('正常系', () => {
    const member1 = new Member({
      id: faker.datatype.uuid(),
      name: new MemberNameVO(faker.name.firstName()),
      email: new MemberEmailVO(faker.internet.email()),
      status: MemberStatus.create(),
    });

    const data = {
      id: faker.datatype.uuid(),
      title: faker.name.jobTitle(),
      content: faker.name.jobDescriptor(),
    };
    const task1 = new Task(data);

    expect(
      ProgressFactory.execute({ member: member1, taskList: [task1] })
    ).toBeInstanceOf(Array);
  });
});
