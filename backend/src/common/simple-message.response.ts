import { ApiProperty } from '@nestjs/swagger';

export class SimpleMessageResponse {
    @ApiProperty()
    public message: string;
}
