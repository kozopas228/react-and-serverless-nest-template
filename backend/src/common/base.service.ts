import {
    BatchWriteCommand,
    DeleteCommand,
    QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDbClientService } from '../aws/dynamo-db-client.service';
import { S3ClientService } from '../aws/s3-client.service';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NotFoundException } from '@nestjs/common';
import { SesClientService } from '../aws/ses-client.service';
import { BaseEntity } from './base.entity';
import { CatEntity } from '../cats/entities/cat.entity';

export class BaseService {
    constructor(
        protected dynamoDbClientService: DynamoDbClientService,
        protected s3ClientService: S3ClientService,
        protected sesClientService: SesClientService,
        protected configService: ConfigService,
    ) {}

    protected async doesEntityExist(
        PK: string,
        SK: string,
        entityType: string,
    ): Promise<boolean> {
        const docClient = this.dynamoDbClientService.getClient();
        const command = new QueryCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            KeyConditionExpression: 'PK = :pk AND SK = :sk',
            FilterExpression: 'ENTITY_TYPE = :type',
            ExpressionAttributeValues: {
                ':pk': PK,
                ':sk': SK,
                ':type': entityType,
            },
            ConsistentRead: true,
        });

        const response = await docClient.send(command);

        if (!response.Items) {
            return false;
        }

        return response.Items.length > 0;
    }

    // TODO find out whether i need this
    protected async saveImageToS3(
        image: Buffer,
        objectKey: string,
    ): Promise<void> {
        const s3Client = this.s3ClientService.getClient();

        const s3PutCommand = new PutObjectCommand({
            Body: image,
            Bucket: this.configService.get('AWS_S3_BUCKET'),
            Key: objectKey,
            ContentType: 'image/jpeg',
        });

        await s3Client.send(s3PutCommand);
    }

    protected async getS3SignedUrl(
        objectKey?: string,
    ): Promise<string | undefined> {
        if (!objectKey) {
            return undefined;
        }

        const params = {
            Bucket: this.configService.get('AWS_S3_BUCKET'),
            Key: objectKey,
        };

        const signedUrl = await getSignedUrl(
            this.s3ClientService.getClient(),
            new GetObjectCommand(params),
            {
                expiresIn: this.configService.get<number>(
                    'AWS_S3_SIGNED_URL_TTL',
                ),
            },
        );

        return signedUrl;
    }

    protected async findEntity<T extends BaseEntity>(
        PK: string,
        SK: string,
        entityType: string,
    ): Promise<T> {
        const findEntityCommand = new QueryCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            KeyConditionExpression: 'PK = :pk AND SK = :sk',
            FilterExpression: 'ENTITY_TYPE = :type',
            ExpressionAttributeValues: {
                ':pk': PK,
                ':sk': SK,
                ':type': entityType,
            },
            ConsistentRead: true,
        });

        const findEntityResponse = await this.dynamoDbClientService
            .getClient()
            .send(findEntityCommand);

        if (
            !findEntityResponse.Items ||
            findEntityResponse.Items.length === 0
        ) {
            throw new NotFoundException(`${entityType} was not found`);
        }

        return findEntityResponse.Items[0] as T;
    }

    protected async findEntities<T>(
        PK: string,
        entityType: string,
    ): Promise<T[]> {
        const findEntitiesCommand = new QueryCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            KeyConditionExpression: 'PK = :pk',
            FilterExpression: 'ENTITY_TYPE = :type',
            ExpressionAttributeValues: {
                ':pk': PK,
                ':type': entityType,
            },
            ConsistentRead: true,
        });

        const findEntitiesResponse = await this.dynamoDbClientService
            .getClient()
            .send(findEntitiesCommand);

        return findEntitiesResponse.Items as T[];
    }

    public async removeEntity(
        PK: string,
        SK: string,
        entityType: string,
    ): Promise<void> {
        if (!(await this.doesEntityExist(PK, SK, entityType))) {
            throw new NotFoundException(`${entityType} does not exist`);
        }

        const command = new DeleteCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: PK,
                SK: SK,
            },
        });

        await this.dynamoDbClientService.getClient().send(command);
    }

    protected async executeBatchRequests(requests: any[]): Promise<void> {
        // Batch the put requests into chunks of 25
        const batches = [];
        while (requests.length) {
            batches.push(
                requests.splice(
                    0,
                    this.configService.get<number>('AWS_DYNAMODB_BATCH_SIZE'),
                ),
            );
        }

        // Execute all batches
        for (const batch of batches) {
            const batchCommand = new BatchWriteCommand({
                RequestItems: {
                    [this.configService.get('AWS_DYNAMODB_TABLE')]: batch,
                },
            });

            await this.dynamoDbClientService.getClient().send(batchCommand);
        }
    }
}
