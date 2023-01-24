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

    app.get('/day', async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const { date } = getDayParams.parse(request.query)

        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day')

        // Todos hábitos possíveis
        // Hábitos que já foram completados

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date,
                },
                weekDays: {
                    some: {
                        week_day: weekDay,
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(),
            },
            include: {
                dayHabits: true,
            }
        })
        
        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        })

        return {
            possibleHabits,
            completedHabits
        }
    })

    
}