import { FastifyInstance } from 'fastify'
import { prisma } from "./lib/prisma"
import { z } from 'zod'
import dayjs from 'dayjs'

export async function appRoutes(app: FastifyInstance) {
    app.post('/habits', async (request) => {
        /**
         * Rota de criação de hábitos, recebe
         * title e weekDays (recorrência do hábito)
         */
        const createHabitBody = z.object({
            tittle: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })
        
        const { tittle, weekDays } = createHabitBody.parse(request.body)
        
        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data: {
                tittle,
                created_at: today,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay,
                        }
                    })
                }
            }
        })

    })
}