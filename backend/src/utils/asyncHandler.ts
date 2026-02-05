import { type Request, type Response, type NextFunction, type RequestHandler } from "express";

const asynHandler = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch(error => next(error));
    }
};

export default asynHandler;