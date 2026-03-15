import { ExceptionProcessor, HttpError } from "./http-error";
import { ResponseHandler } from "./response";
import { mapPrismaError } from "../utils/prisma.error";
import { Request, Response } from "express";

export function asyncWrapper(fn: (request: Request, response: Response) => Promise<any>) {
  return async (request: Request, reply: Response) => {
    try {
      return await fn(request, reply);
    } catch (err: any) {
      // Check for Prisma errors first
      const prismaErr = mapPrismaError(err);
      if (prismaErr) {
        return ResponseHandler.error(reply, prismaErr, prismaErr.code, prismaErr.status);
      }
      
      // Check for custom HTTP errors
      if (err instanceof HttpError) {
        return ResponseHandler.error(reply, err, 101, err.statusCode);
      }
      
      // Handle external API errors
      if (err?.response) {
        ExceptionProcessor.handle(err);
        return ResponseHandler.error(reply, err, 102, 502);
      }
      
      // Default error handler
      return ResponseHandler.error(reply, err, 999, 500);
    }
  };
}
