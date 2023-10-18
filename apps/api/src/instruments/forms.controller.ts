import { type EntityController, ParseIdPipe } from '@douglasneuroinformatics/nestjs/core';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FormInstrument } from '@open-data-capture/types';

import { RouteAccess } from '@/core/decorators/route-access.decorator';

import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { FormsService } from './forms.service';

@ApiTags('Instruments')
@Controller({ path: 'instruments/forms' })
export class FormsController implements EntityController<FormInstrument> {
  constructor(private readonly formsService: FormsService) {}

  @ApiOperation({ summary: 'Create Form' })
  @Post()
  @RouteAccess({ action: 'create', subject: 'Instrument' })
  async create(@Body() form: CreateFormDto) {
    return this.formsService.create(form);
  }

  @ApiOperation({ summary: 'Delete Form' })
  @Delete(':id')
  @RouteAccess({ action: 'delete', subject: 'Instrument' })
  deleteById(@Param('id', ParseIdPipe) id: string) {
    return this.formsService.deleteById(id);
  }

  @ApiOperation({ summary: 'Get All Forms' })
  @Get()
  @RouteAccess({ action: 'read', subject: 'Instrument' })
  async findAll() {
    return this.formsService.findAll();
  }

  @ApiOperation({ summary: 'Get Form' })
  @Get(':id')
  @RouteAccess({ action: 'read', subject: 'Instrument' })
  async findById(@Param('id', ParseIdPipe) id: string) {
    return this.formsService.findById(id);
  }

  @ApiOperation({ summary: 'Update Form' })
  @Patch(':id')
  @RouteAccess({ action: 'update', subject: 'Instrument' })
  updateById(@Param('id', ParseIdPipe) id: string, @Body() update: UpdateFormDto) {
    return this.formsService.updateById(id, update);
  }
}
