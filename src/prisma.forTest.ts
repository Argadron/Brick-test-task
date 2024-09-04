import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient

export default () => {
    if (prisma) return prisma 
    else {
        prisma = new PrismaClient()

        return prisma
    }
}