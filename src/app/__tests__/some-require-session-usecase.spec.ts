import { UserSession, UserRole } from '../session-interface/user-session';
import { SomeRequireSessionUseCase } from '../some-require-session-usecase';

describe('some-require-session', () => {
  let mockUserSession: UserSession;
  beforeEach(() => {
    mockUserSession = {
      uid: '1',
      email: 'sample@example.com',
      phone_number: '0000000000',
      userRole: UserRole.ADMIN,
    };
  });

  it('正常に実行', () => {
    const userSession = mockUserSession;
    const usecase = new SomeRequireSessionUseCase();
    expect(usecase.execute(userSession)).toBe(mockUserSession.uid);
  });
});
