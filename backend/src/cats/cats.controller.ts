import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import {
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { CatEntity } from './entities/cat.entity';
import { CatDto } from './dto/cat.dto';

@ApiTags('Example Cats controller')
@Controller('cats')
export class CatsController {
    constructor(private readonly catsService: CatsService) {}

    @Get('test')
    public test(): string {
        return process.env.FRONTEND_URL ?? '';
    }

    @ApiOperation({ summary: 'Get all cats' })
    @ApiOkResponse({
        description: 'Successful entities retrieval',
        type: [CatEntity],
    })
    @ApiNotFoundResponse({
        description: 'Cats were not found',
    })
    @Get()
    public async findAll(): Promise<CatDto[]> {
        return await this.catsService.findAll();
    }

    @ApiOperation({ summary: 'Get one Cat' })
    @ApiOkResponse({
        description: 'Successful entity retrieval',
        type: CatEntity,
    })
    @ApiNotFoundResponse({
        description: 'Cat was not found',
    })
    @Get(':PK/:SK')
    public async findOne(
        @Param('PK') PK: string,
        @Param('SK') SK: string,
    ): Promise<CatDto> {
        return await this.catsService.findOne(PK, SK);
    }

    @ApiOperation({ summary: 'Create a new Cat' })
    @ApiCreatedResponse({
        description: 'Successful creation of entity',
        type: CatEntity,
    })
    @Post()
    public async create(@Body() createCatDto: CreateCatDto): Promise<CatDto> {
        return await this.catsService.create(createCatDto);
    }

    @ApiOperation({ summary: 'Update existing Cat' })
    @ApiOkResponse({
        description: 'Successful update',
    })
    @ApiNotFoundResponse({
        description: 'Cat was not found',
    })
    @Patch(':PK/:SK')
    public async update(
        @Param('PK') PK: string,
        @Param('SK') SK: string,
        @Body() updateCatDto: UpdateCatDto,
    ): Promise<void> {
        return await this.catsService.update(PK, SK, updateCatDto);
    }

    @ApiOperation({
        summary: 'Delete existing Cat',
    })
    @ApiNoContentResponse({
        description: 'Cat has been removed',
    })
    @Delete(':PK/:SK')
    public async remove(
        @Param('PK') PK: string,
        @Param('SK') SK: string,
    ): Promise<void> {
        return await this.catsService.remove(PK, SK);
    }
}
