import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SomeRequireSessionUseCase } from 'src/app/some-require-session-usecase';
import { FirebaseSecuritySessionProvider } from '../infra/session/user-session';
import { GetSomeThingResponse } from './response/get-something-response';

@Controller({
  path: '/something',
})
export class SomeThingController {
  @Get()
  @ApiResponse({ status: 200, type: GetSomeThingResponse })
  async getSomeThing(): Promise<void> {
    const someRequireSessionUseCase = new SomeRequireSessionUseCase();
    const sessionProvider = new FirebaseSecuritySessionProvider(); // ダミー
    const userSession = sessionProvider.getUserSession();
    someRequireSessionUseCase.execute(userSession);
  }
}
