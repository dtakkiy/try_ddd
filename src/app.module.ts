import { Module } from '@nestjs/common';
import { SampleController } from './controller/sample/some-data.controller';

// memo: DIコンテナとしては使わないため、controllerの追加だけしてください
@Module({
  imports: [],
  controllers: [SampleController],
  providers: [],
})
export class AppModule {}
