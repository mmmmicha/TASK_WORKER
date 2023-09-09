import { Request, Response, NextFunction } from "express";
import { CustomError, responseGen, ResultCode } from "../biz/util";

export const CheckAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/health-check")) return next();

    if (req.headers['api-key']) {
        try {
            const apiKey = req.headers['api-key'] as string;
			if (apiKey !== process.env.API_KEY) throw new CustomError(401, ResultCode.PermissionDenied, "Invalid API Key");
            return next();
        } catch (err) {
            if (err instanceof CustomError) return responseGen({ res, payload: err, resultCode: err.resultCode, httpCode: err.httpCode, msg: err.msg });
            else return responseGen({ res, payload: err, httpCode: 500, msg: 'Unknown error' });
        }
    }

    res.status(401).end();
};