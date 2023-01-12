import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Instrument } from 'common';

import { InstrumentRecordDto } from './dto/instrument-record.dto';
import { InstrumentDto } from './dto/instrument.dto';
import { InstrumentsService } from './instruments.service';

@ApiTags('Instruments')
@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  @ApiOperation({ summary: 'Create an Instrument' })
  @Post()
  create(@Body() dto: InstrumentDto): Promise<InstrumentDto> {
    return this.instrumentsService.create(dto);
  }

  @ApiOperation({
    description: 'Get all instruments',
    summary: 'Get All'
  })
  @Get()
  @ApiOkResponse({ description: 'Success' })
  getAll(): Promise<Instrument[]> {
    return this.instrumentsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Instrument> {
    return this.instrumentsService.getById(id);
  }

  @Post(':id')
  insertRecord(@Param('id') id: string, @Body() dto: InstrumentRecordDto): Promise<any> {
    return this.instrumentsService.insertRecord(id, dto);
  }
}
