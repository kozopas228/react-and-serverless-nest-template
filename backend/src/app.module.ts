import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CatsModule } from './cats/cats.module';
import { AwsModule } from './aws/aws.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        // we are ignoring .env files because serverless load env variables by itself,
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        AwsModule.forRoot(),
        CatsModule,
    ],
})
export class AppModule {}
