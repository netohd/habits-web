/** Back End Ideia
 * ideia do back end aqui é ser uma API RESTful
 * com as rotas http (ex: rota para criação)
 * de habitos localhost:333/habits onde o
 * front chama essas rotas
 */

import Fastify from 'fastify'
import {PrismaClient} from '@prisma/client'
import cors from '@fastify/cors'

const app = Fastify()
const prisma = new PrismaClient()

/** HTTP
 * Get (busca info), 
 * Post (cria info), 
 * Put (atualiza recurso),
 * Patch (atualiza recurso específico), 
 * Delete (apaga recurso)
 * Navegador faz apenas operações GET
 */

app.register(cors)

app.get('/hello', async () => {
    const habits = await prisma.habit.findMany()

    return habits
})

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP Server running!')
})