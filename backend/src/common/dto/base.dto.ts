import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
    @ApiProperty({ example: 'PK:54c12a62-6613-4e11-98b1-4624df7f0947' })
    public PK: string;

    @ApiProperty({ example: 'SK:54c12a62-6613-4e11-98b1-4624df7f0947' })
    public SK: string;
}
