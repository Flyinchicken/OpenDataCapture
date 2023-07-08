import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { type AppAbility } from '@douglasneuroinformatics/common';

import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { LookupSubjectDto } from './dto/lookup-subject.dto.js';
import { SubjectEntity } from './entities/subject.entity.js';
import { SubjectsService } from './subjects.service.js';

import { RouteAccess } from '@/core/decorators/route-access.decorator.js';
import { UserAbility } from '@/core/decorators/user-ability.decorator.js';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @ApiOperation({ summary: 'Create Subject' })
  @Post()
  @RouteAccess({ action: 'create', subject: 'Subject' })
  create(@Body() createSubjectDto: CreateSubjectDto): Promise<SubjectEntity> {
    return this.subjectsService.create(createSubjectDto);
  }

  @ApiOperation({ summary: 'Get All Subjects' })
  @Get()
  @RouteAccess({ action: 'read', subject: 'Subject' })
  findAll(@UserAbility() ability: AppAbility, @Query('group') groupName?: string): Promise<SubjectEntity[]> {
    return this.subjectsService.findAll(ability, groupName);
  }

  @ApiOperation({ summary: 'Lookup Subject' })
  @Post('lookup')
  @RouteAccess({ action: 'read', subject: 'Subject' })
  lookup(@Body() lookupSubjectDto: LookupSubjectDto): Promise<SubjectEntity> {
    return this.subjectsService.lookup(lookupSubjectDto);
  }
}