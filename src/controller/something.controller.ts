import {
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
  async getSomeThing(
    @Headers('Authorization') authToken: string
  ): Promise<void> {
    const someRequireSessionUseCase = new SomeRequireSessionUseCase();
    const sessionProvider = FirebaseSecuritySessionProvider.create(authToken);
    if (!sessionProvider) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'auth error',
        },
        HttpStatus.UNAUTHORIZED
      );
    }
    const userSession = sessionProvider.getUserSession();
    someRequireSessionUseCase.execute(userSession);
  }
}
