"use strict";

async function noteRoutes(fastify, options) {
    // Create Note
    fastify.post("/notes", async (request, reply) => {
        const { content, customerId } = request.body;

        try {
            const note = await fastify.prisma.note.create({
                data: { content, customerId: parseInt(customerId) },
            });
            reply.code(201).send(note);
        } catch (err) {
            reply.code(400).send({ message: "Invalid customerId or input" });
        }
    });

    // Get all notes
    fastify.get("/notes", async () => {
        return await fastify.prisma.note.findMany({
            include: { customer: true },
        });
    });

    // Get one note
    fastify.get("/notes/:id", async (request, reply) => {
        const note = await fastify.prisma.note.findUnique({
            where: { id: parseInt(request.params.id) },
            include: { customer: true },
        });
        if (!note) return reply.code(404).send({ message: "Note not found" });
        return note;
    });

    // Update note
    fastify.put("/notes/:id", async (request, reply) => {
        const { content } = request.body;
        const note = await fastify.prisma.note.update({
            where: { id: parseInt(request.params.id) },
            data: { content },
        });
        return note;
    });

    // Delete note
    fastify.delete("/notes/:id", async (request, reply) => {
        await fastify.prisma.note.delete({
            where: { id: parseInt(request.params.id) },
        });
        return { message: "Note deleted" };
    });
}

module.exports = noteRoutes;
