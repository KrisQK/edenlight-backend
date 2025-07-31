// plugins/prisma.js
"use strict";
const fp = require("fastify-plugin");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = fp(async (fastify, opts) => {
    fastify.decorate("prisma", prisma);

    fastify.addHook("onClose", async app => {
        await app.prisma.$disconnect();
    });
});
