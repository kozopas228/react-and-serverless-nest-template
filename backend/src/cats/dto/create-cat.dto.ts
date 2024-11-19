import { PickType } from '@nestjs/swagger';
import { CatDto } from './cat.dto';

export class CreateCatDto extends PickType(CatDto, [
    'name',
    'gender',
    'breed',
] as const) {}
