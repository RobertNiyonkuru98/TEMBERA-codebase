import { serializeBigInt } from "./serialize";
import { Response } from "express";

export class ResponseHandler {
  static success(
    reply: Response,
    resp_code: number = 100,
    message = "Success",
    data: any = null,
    statusCode: number = 200,
  ) {
    if (data && typeof data === "object" && "pagination" in data) {
      return reply.status(statusCode).send({
        success: true,
        resp_msg: message,
        resp_code,
        data: serializeBigInt(data.data),
        pagination: serializeBigInt(data.pagination),
      });
    }

    return reply.status(statusCode).send({
      success: true,
      resp_msg: message,
      resp_code,
      data: serializeBigInt(data),
    });
  }

  static error(reply: Response, error: any, resp_code: number = 101, statusCode: number = 400) {
    return reply.status(statusCode).send({
      success: false,
      resp_msg:
        error?.message ||
        error ||
        "We couldn't process this request, Please contact gwiza customer support for assistance.",
      resp_code,
      errors: error?.details || null,
      data: error?.emptyData ?? null,
    });
  }
}
