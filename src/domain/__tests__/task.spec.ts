import * as faker from 'faker';
import { Task } from '../task';

describe('taskの単体テスト', () => {
  let data = { id: '', title: '', content: '' };

  beforeEach(() => {
    data = {
      id: faker.datatype.uuid(),
      title: faker.name.jobTitle(),
      content: faker.name.jobDescriptor(),
    };
  });

  it('インスタンスを生成できる', () => {
    const task = new Task(data);
    expect(task).toBeInstanceOf(Task);
  });

  it('属性を取得できる', () => {
    const taskId = faker.datatype.uuid();
    const data = {
      id: taskId,
      title: 'サンプルタイトル',
      content: '本文',
    };

    const task = new Task(data);
    expect(task).toBeInstanceOf(Task);

    expect(task.id).toBe(taskId);
    expect(task.title).toMatch(/サンプルタイトル/);
    expect(task.content).toMatch(/本文/);
  });
});
