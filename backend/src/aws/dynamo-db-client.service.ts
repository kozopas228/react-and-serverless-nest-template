import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Injectable()
export class DynamoDbClientService {
    private docClient: DynamoDBDocumentClient;

    public getClient(): DynamoDBDocumentClient {
        if (this.docClient) {
            return this.docClient;
        }

        const client = new DynamoDBClient({});
        this.docClient = DynamoDBDocumentClient.from(client);

        console.log('DB client created');

        return this.docClient;
    }
}
