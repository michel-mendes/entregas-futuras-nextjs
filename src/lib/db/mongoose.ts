import mongoose from 'mongoose';

// Interface para o cache global da conexão com o banco
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongooseCache: MongooseCache;
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
    const MONGODB_URI = process.env.MONGODB_URI!;

    if (!MONGODB_URI) {

        if (process.env.NODE_ENV === "test") {
            console.warn("Aviso: MONGODB_URI não definida no ambiente de testes.");
            return null;
        }

        throw new Error('Por favor, defina a variável de ambiente "MONGODB_URI" dentro do arquivo ".env.local"');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}