import mongoose, { Document } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export interface WorkersInterface extends Document {
    workerName: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
    query?: any;
    data?: any;
    headers?: any;
}

var WorkersSchema = new mongoose.Schema<WorkersInterface>(
    {
        workerName: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        method: {
            type: String,
            enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
            required: true,
        },
        query: {
            type: Object,
            required: false,
        },
        data: {
            type: Object,
            required: false,
        },
        headers: {
            type: Object,
            required: false,
        },
    }
);

const Workers = mongoose.connection.useDb(process.env.MONGO_DB_COLLECTION_TIMER).model<WorkersInterface>('Workers', WorkersSchema);

export default Workers;
