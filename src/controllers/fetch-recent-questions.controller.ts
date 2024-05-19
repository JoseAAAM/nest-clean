import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const pageValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

type PageQueryParamSearch = z.infer<typeof pageQueryParamsSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}
  @Get()
  async handle(@Query('page', pageValidationPipe) page: PageQueryParamSearch) {
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { questions }
  }
}
