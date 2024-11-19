import { Module } from '@nestjs/common';
import { DynamoDbClientService } from './dynamo-db-client.service';
import { S3ClientService } from './s3-client.service';
import { SesClientService } from './ses-client.service';

@Module({})
export class AwsModule {
    public static forRoot() {
        return {
            module: AwsModule,
            providers: [
                DynamoDbClientService,
                S3ClientService,
                SesClientService,
            ],
            exports: [DynamoDbClientService, S3ClientService, SesClientService],
            global: true,
        };
    }
}
