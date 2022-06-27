import { UserSession, UserRole } from '../session-interface/user-session';
import { SomeRequireSessionUseCase } from '../some-require-session-usecase';

describe('some-require-session', () => {
  let mockUserSession: UserSession;
  beforeEach(() => {
    mockUserSession = {
      userId: '1',
      userRole: UserRole.ADMIN,
    };
  });

  it('正常', () => {
    const userSession = mockUserSession;
    const useCase = new SomeRequireSessionUseCase();
    useCase.execute(userSession);

    // テスト
  });
});
