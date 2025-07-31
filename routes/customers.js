async function customerRoutes(fastify, options) {
    // Create
    fastify.post("/customers", async (request, reply) => {
        const { name, email, phone } = request.body;
        const customer = await fastify.prisma.customer.create({
            data: { name, email, phone },
        });
        return customer;
    });

    // Read All
    fastify.get("/customers", async (request, reply) => {
        const customers = await fastify.prisma.customer.findMany();
        return customers;
    });

    // Read One
    fastify.get("/customers/:id", async (request, reply) => {
        const customer = await fastify.prisma.customer.findUnique({
            where: { id: parseInt(request.params.id) },
        });
        if (!customer) {
            return reply.code(404).send({ message: "Customer not found" });
        }
        return customer;
    });

    // Update
    // Update
    fastify.put("/customers/:id", async (request, reply) => {
        const id = parseInt(request.params.id);
        const { name, email, phone } = request.body;
        try {
            const customer = await fastify.prisma.customer.update({
                where: { id },
                data: { name, email, phone },
            });
            return customer;
        } catch (error) {
            return reply.code(404).send({ message: "Customer not found" });
        }
    });
    // Delete
    fastify.delete("/customers/:id", async (request, reply) => {
        const id = parseInt(request.params.id);
        try {
            await fastify.prisma.customer.delete({ where: { id } });
            return { message: "Customer deleted" };
        } catch (error) {
            return reply.code(404).send({ message: "Customer not found" });
        }
    });
}

module.exports = customerRoutes;
