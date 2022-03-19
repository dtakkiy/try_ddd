import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';

@Controller({
  path: '/pairs',
})
export class PairController {}
