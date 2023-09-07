import express from 'express';
import { postOff, postOn } from '../biz/workersBiz';
import { CustomError, responseGen, ResultCode } from '../biz/util';
import winston from 'winston';
const router = express.Router();

router.post('/on', async (req, res, next) => {
    try {
		await postOn();
		return responseGen({ res: res, payload: null, resultCode: ResultCode.OK, httpCode: 200, msg: 'ok', });
	} catch (error) {
		console.error('Error in /on' + error);
		winston.error('Error in /on' + error.message);
		if (error instanceof CustomError) {
			return responseGen({ res, payload: error, resultCode: error.resultCode, httpCode: error.httpCode, msg: error.msg });
		} else {
			return responseGen({ res, payload: error, httpCode: 500,  msg: 'Unknown error' });
		}
	}
});

router.post('/off', async (req, res, next) => {
	try {
		await postOff();
		return responseGen({ res: res, payload: null, resultCode: ResultCode.OK, httpCode: 200, msg: 'ok', });
	} catch (error) {
		console.error('Error in /off' + error);
		winston.error('Error in /off' + error.message);
		if (error instanceof CustomError) {
			return responseGen({ res, payload: error, resultCode: error.resultCode, httpCode: error.httpCode, msg: error.msg });
		} else {
			return responseGen({ res, payload: error, httpCode: 500,  msg: 'Unknown error' });
		}
	}
});

export default router;