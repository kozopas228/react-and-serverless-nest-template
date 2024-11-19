import { Inject, Injectable, Logger, Scope } from '@nestjs/common';

import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3ClientService {
    private s3Client: S3Client;

    public getClient(): S3Client {
        if (this.s3Client) {
            return this.s3Client;
        }

        this.s3Client = new S3Client();

        console.log('S3 client created');

        return this.s3Client;
    }
}
