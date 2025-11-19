import { Request, Response, NextFunction } from "express";
import { Unauthorized } from "../lib/api-response";

const checkSession = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.user) {
    req.user = req.session.user;
    next();
  } else {
    res.status(401).json(Unauthorized("Session expired"));
  }
};

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.user) {
    // Internal request
    checkSession(req, res, next);
  } else {
    res.status(401).json(Unauthorized());
  }
};

export { authenticate };