import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { SESClient } from '@aws-sdk/client-ses';

@Injectable()
export class SesClientService {
    private sesClient: SESClient;

    public getClient(): SESClient {
        if (this.sesClient) {
            return this.sesClient;
        }

        this.sesClient = new SESClient();

        console.log('SES client created');

        return this.sesClient;
    }
}
