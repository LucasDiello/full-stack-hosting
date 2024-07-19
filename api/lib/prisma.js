import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const testConnection = async () => {
    try {
        await prisma.$connect();
        console.log('Connected to the database');
        console.log(process.env.DATABASE_URL);
    } catch (error) {
        console.error('Unable to connect to the database');
        console.error(error);
    }
}

testConnection();

export default prisma;