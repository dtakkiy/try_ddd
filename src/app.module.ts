import { Module } from '@nestjs/common';
import { MemberController } from './controller/member.controller';

// memo: DIコンテナとしては使わないため、controllerの追加だけしてください
@Module({
  imports: [],
  controllers: [MemberController],
  providers: [],
})
export class AppModule {}
