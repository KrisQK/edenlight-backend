"use strict";

async function orderRoutes(fastify, options) {
    // Create Order
    fastify.post("/orders", async (request, reply) => {
        const { customerId, productIds, totalPrice } = request.body;

        try {
            const order = await fastify.prisma.order.create({
                data: {
                    customerId: parseInt(customerId),
                    totalPrice: parseFloat(totalPrice),
                    products: {
                        connect: productIds.map(id => ({ id: parseInt(id) })),
                    },
                },
                include: { products: true },
            });

            reply.code(201).send(order);
        } catch (err) {
            reply.code(400).send({ message: "Create failed", error: err });
        }
    });

    // Get all orders
    fastify.get("/orders", async () => {
        return await fastify.prisma.order.findMany({
            include: { customer: true, products: true },
        });
    });

    // Get single order
    fastify.get("/orders/:id", async (request, reply) => {
        const order = await fastify.prisma.order.findUnique({
            where: { id: parseInt(request.params.id) },
            include: { customer: true, products: true },
        });
        if (!order) return reply.code(404).send({ message: "Order not found" });
        return order;
    });

    // Delete order
    fastify.delete("/orders/:id", async (request, reply) => {
        await fastify.prisma.order.delete({
            where: { id: parseInt(request.params.id) },
        });
        return { message: "Order deleted" };
    });
}

module.exports = orderRoutes;
