import {
    BadRequestException,
    Injectable,
    NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { BaseService } from '../common/base.service';
import { CatEntity } from './entities/cat.entity';
import {
    DeleteCommand,
    PutCommand,
    QueryCommand,
    ScanCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { CatDto } from './dto/cat.dto';
import { CatsMapper } from './mappers/cats.mapper';
import { SesClientService } from '../aws/ses-client.service';
import { DynamoDbClientService } from '../aws/dynamo-db-client.service';
import { S3ClientService } from '../aws/s3-client.service';
import { ConfigService } from '@nestjs/config';
import * as chance from 'chance';

@Injectable()
export class CatsService extends BaseService {
    constructor(
        dynamoDbClientService: DynamoDbClientService,
        s3ClientService: S3ClientService,
        configService: ConfigService,
        sesClientService: SesClientService,
    ) {
        super(
            dynamoDbClientService,
            s3ClientService,
            sesClientService,
            configService,
        );
    }
    public async create(createCatDto: CreateCatDto): Promise<CatDto> {
        const entity = CatEntity.build(
            createCatDto.name,
            createCatDto.gender,
            createCatDto.breed,
        );

        const command = new PutCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Item: entity.toDynamoDbItem(),
        });

        await this.dynamoDbClientService.getClient().send(command);

        return CatsMapper.mapEntityToDto(entity);
    }

    public async findAll(): Promise<CatDto[]> {
        const now = Date.now();

        // artificial delay, to make loading in FE more visible
        while (Date.now() < now + 1000) {}

        if (chance.Chance().bool({ likelihood: 70 })) {
            throw new UnauthorizedException(
                'Test exception, for frontend test only',
            );
        }

        const command = new ScanCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            FilterExpression: 'ENTITY_TYPE = :type',
            ExpressionAttributeValues: {
                ':type': CatEntity.entityType,
            },
            ConsistentRead: true,
        });

        const response = await this.dynamoDbClientService
            .getClient()
            .send(command);

        const entities = response.Items as CatEntity[];

        return entities.map((e) => CatsMapper.mapEntityToDto(e));
    }

    public async findOne(PK: string, SK: string): Promise<CatDto> {
        const entity = await this.findEntity<CatEntity>(
            PK,
            SK,
            CatEntity.entityType,
        );

        return CatsMapper.mapEntityToDto(entity);
    }

    public async update(
        PK: string,
        SK: string,
        updateCatDto: UpdateCatDto,
    ): Promise<void> {
        if (!(await this.doesEntityExist(PK, SK, CatEntity.entityType))) {
            throw new NotFoundException('Cat does not exist');
        }

        const updateFields: string[] = [];
        const expressionAttributeNames: Record<string, string> = {};
        const expressionAttributeValues: Record<string, unknown> = {};

        if (updateCatDto.name) {
            updateFields.push('#nameAttribute = :catName');
            expressionAttributeNames['#nameAttribute'] = 'name';
            expressionAttributeValues[':catName'] = updateCatDto.name;
        }

        if (updateCatDto.gender) {
            updateFields.push('#genderAttribute = :catGender');
            expressionAttributeNames['#genderAttribute'] = 'gender';
            expressionAttributeValues[':catGender'] = updateCatDto.gender;
        }

        if (updateCatDto.breed) {
            updateFields.push('#breedAttribute = :breedValue');
            expressionAttributeNames['#breedAttribute'] = 'breed';
            expressionAttributeValues[':breedValue'] = updateCatDto.breed;
        }

        updateFields.push('UPDATED_AT = :updAt');
        expressionAttributeValues[':updAt'] = Date.now();

        const updateExpression = `SET ${updateFields.join(', ')}`;

        const updateCommand = new UpdateCommand({
            TableName: this.configService.get('AWS_DYNAMODB_TABLE'),
            Key: {
                PK: PK,
                SK: SK,
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        });

        await this.dynamoDbClientService.getClient().send(updateCommand);
    }

    public async remove(PK: string, SK: string): Promise<void> {
        return await this.removeEntity(PK, SK, CatEntity.entityType);
    }
}
