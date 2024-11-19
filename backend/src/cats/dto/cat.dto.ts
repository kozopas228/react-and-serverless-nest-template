import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { CatGenderEnum } from '../enums/cat-gender.enum';
import { BaseDto } from '../../common/dto/base.dto';
import { CatBreedEnum } from '../enums/cat-breed.enum';

export class CatDto extends BaseDto {
    @ApiProperty({ example: 'Felix' })
    @IsNotEmpty()
    @MaxLength(100)
    public name: string;

    @ApiProperty({ enum: CatGenderEnum, example: 'Male' })
    @IsNotEmpty()
    @IsEnum(CatGenderEnum)
    public gender: CatGenderEnum;

    @ApiProperty({ enum: CatBreedEnum, example: CatBreedEnum.BritishShorthair })
    @IsNotEmpty()
    @IsEnum(CatBreedEnum)
    public breed: CatBreedEnum;
}
