"use strict";

async function productRoutes(fastify, options) {
    // Create
    fastify.post("/products", async (request, reply) => {
        const { name, price } = request.body;
        const product = await fastify.prisma.product.create({
            data: { name, price },
        });
        reply.code(201).send(product);
    });

    // Read All
    fastify.get("/products", async () => {
        return await fastify.prisma.product.findMany();
    });

    // Read One
    fastify.get("/products/:id", async (request, reply) => {
        const product = await fastify.prisma.product.findUnique({
            where: { id: parseInt(request.params.id) },
        });
        if (!product)
            return reply.code(404).send({ message: "Product not found" });
        return product;
    });

    // Update
    fastify.put("/products/:id", async (request, reply) => {
        const { name, price } = request.body;
        const updated = await fastify.prisma.product.update({
            where: { id: parseInt(request.params.id) },
            data: { name, price },
        });
        return updated;
    });

    // Delete
    fastify.delete("/products/:id", async (request, reply) => {
        await fastify.prisma.product.delete({
            where: { id: parseInt(request.params.id) },
        });
        return { message: "Product deleted" };
    });
}

module.exports = productRoutes;
