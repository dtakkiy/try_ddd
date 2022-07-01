import * as faker from 'faker';
import { ProgressFactory } from '../domain-service/progress-factory';
import { Member } from '../member';
import { MemberEmailVO } from '../member-email-vo';
import { MemberNameVO } from '../member-name-vo';
import { MemberStatusVO } from '../member-status-vo';
import { Task } from '../task';

describe('progress factoryのテスト', () => {
  it('正常系', () => {
    const member1 = Member.create({
      id: faker.datatype.uuid(),
      name: new MemberNameVO(faker.name.firstName()),
      email: new MemberEmailVO(faker.internet.email()),
      status: MemberStatusVO.create(),
    });

    if (member1.isFailure()) {
      return;
    }

    const data = {
      id: faker.datatype.uuid(),
      title: faker.name.jobTitle(),
      content: faker.name.jobDescriptor(),
    };

    const task1 = Task.reconstruct(data);
    expect(
      ProgressFactory.execute({ member: member1.value, taskList: [task1] })
    ).toBeInstanceOf(Array);
  });
});
