import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PK_SK_REGEX } from '../../util/regexp';

export class PkSkParamDto {
    @ApiProperty({
        description: 'A string containing PK and SK separated by an underscore',
        example:
            'PK#4790fec4-0b66-48dd-bbd0-e61cfdb654e0_SK#72b7187a-f547-4e70-adf7-115ac8e6ecb2',
    })
    @IsString()
    @Matches(PK_SK_REGEX, {
        message:
            "Invalid format for param. It must be in the format 'PartitionKey_SortKey'",
    })
    public PK_SK: string;
}
