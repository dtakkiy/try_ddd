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
    const task1 = Task.reconstruct(data);
    expect(task1).toBeInstanceOf(Task);
  });

  it('属性を取得できる', () => {
    const taskId = faker.datatype.uuid();
    const data = {
      id: taskId,
      title: 'サンプルタイトル',
      content: '本文',
    };

    const task1 = Task.reconstruct(data);
    const { id, title, content } = task1.getAllProperties();

    expect(task1).toBeInstanceOf(Task);
    expect(id).toBe(taskId);
    expect(title).toMatch(/サンプルタイトル/);
    expect(content).toMatch(/本文/);
  });
});
