import { CatEntity } from '../entities/cat.entity';
import { CatDto } from '../dto/cat.dto';

export class CatsMapper {
    public static mapEntityToDto(entity: CatEntity): CatDto {
        const dto = new CatDto();

        dto.PK = entity.PK;
        dto.SK = entity.SK;
        dto.name = entity.name;
        dto.gender = entity.gender;
        dto.breed = entity.breed;

        return dto;
    }
}
