import express from 'express';
const app = express();

import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import helmet from 'helmet';

import winston from 'winston';
import indexRouter from './routes/index';
import timerRouter from './routes/workersRouter';
import workerRouter from './routes/worker';
import { responseGen } from './biz/util';

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { CheckAuth } from './middleware/auth';
import { errorLogger, requestLogger } from './middleware/logtail';
dotenv.config();

const server = async () => {
    app.use(morgan('dev'));
    app.use(requestLogger);
    console.log('attempting to connect to mongodb');
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('connected to mongodb');

    app.use(cookieParser());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use('/', indexRouter);
    app.use('/timer', CheckAuth, timerRouter);
    app.use('/worker', CheckAuth, workerRouter);

    app.use(errorLogger);
    // catch 404 and forward to error handler
    app.get('*', async function (req, res) {
        return responseGen({
            req: req,
            res: res,
            payload: '404 bipbop not found',
            httpCode: 404,
            msg: 'Page not found',
        });
    });
    // error handler
    app.use(async function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.error = err;
        return responseGen({
            req: req,
            res: res,
            payload: err,
            httpCode: 500,
            msg: err.message,
        });
    });

    app.listen('7770', () => {
        console.info(`Listening to 7770. NODE_ENV: ${process.env.NODE_ENV}`);
        winston.info(`Listening to 7770. NODE_ENV: ${process.env.NODE_ENV}`);
    });

    if (process.env.NODE_ENV === 'production') {
        console.log = function () {};
    }

    return app;
};

server();

export default app;
