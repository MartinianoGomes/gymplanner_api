import fastify from "fastify";
import "express-async-errors"



const app = fastify()

app.get('/', async (request, reply) => {
    return reply.status(201).send('Sucesso!')
})

app.post('/', async (request, reply) => {
    return reply.status(201).send('Sucesso!')
})

app.put('/', async (request, reply) => {
    return reply.status(201).send('Sucesso!')
})

app.delete('/', async (request, reply) => {
    return reply.status(201).send('Sucesso.')
})



app.listen({ port: 3333 }).then(() => {
    console.log("HTTP server running")
})