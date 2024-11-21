import { BaseEntity } from '../../common/base.entity';
import { CatGenderEnum } from '../enums/cat-gender.enum';
import { v4 } from 'uuid';
import { CatBreedEnum } from '../enums/cat-breed.enum';
import { DYNAMODB_KEY_DELIMITER } from '../../utils/constants';

export class CatEntity extends BaseEntity {
    public constructor(
        PK: string,
        SK: string,
        CREATED_AT: number,
        UPDATED_AT: number,
        name: string,
        gender: CatGenderEnum,
        breed: CatBreedEnum,
    ) {
        super(PK, SK, CREATED_AT, UPDATED_AT);

        this.name = name;
        this.gender = gender;
        this.breed = breed;
    }

    public static readonly pkPrefix: string = 'CAT';
    public static readonly skPrefix: string = 'CAT';
    public static readonly entityType: string = 'Cat';

    public name: string;
    public gender: CatGenderEnum;
    public breed: CatBreedEnum;

    public static build(
        name: string,
        gender: CatGenderEnum,
        breed: CatBreedEnum,
    ): CatEntity {
        const uuid = v4();
        const PK = `${CatEntity.pkPrefix}${DYNAMODB_KEY_DELIMITER}${uuid}`;
        const SK = `${CatEntity.skPrefix}${DYNAMODB_KEY_DELIMITER}${uuid}`;

        return new CatEntity(
            PK,
            SK,
            Date.now(),
            Date.now(),
            name,
            gender,
            breed,
        );
    }

    public toDynamoDbItem(): Record<string, unknown> {
        return {
            PK: this.PK,
            SK: this.SK,
            ENTITY_TYPE: CatEntity.entityType,
            CREATED_AT: this.CREATED_AT,
            UPDATED_AT: this.UPDATED_AT,
            name: this.name,
            gender: this.gender,
            breed: this.breed,
        };
    }
}
