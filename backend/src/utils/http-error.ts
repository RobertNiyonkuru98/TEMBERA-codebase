export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public emptyData: any = null,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Resource not found", emptyData: any = []) {
    super(404, message, emptyData);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = "Request invalid") {
    super(400, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = "Resource conflict") {
    super(409, message);
  }
}

export class ServerError extends HttpError {
  constructor(message: string = "Server error") {
    super(500, message);
  }
}

export class ExceptionProcessor {
  private static handleResponseError(status: number, message: string, payload: any): never {
    if (status >= 400 && status < 500) {
      switch (status) {
        case 400:
          throw new BadRequestError(message);
        case 404:
          throw new NotFoundError(message, payload?.data ?? []);
        case 409:
          throw new ConflictError(message);
        default:
          throw new HttpError(status, message, payload);
      }
    }

    if (status >= 500) {
      throw new ServerError(message);
    }

    throw new HttpError(status, message, payload);
  }

  private static handleStatusCodeError(statusCode: number, message: string): never {
    if (statusCode >= 400 && statusCode < 500) {
      switch (statusCode) {
        case 400:
          throw new BadRequestError(message);
        case 401:
          throw new HttpError(401, message);
        case 404:
          throw new NotFoundError(message);
        case 409:
          throw new ConflictError(message);
        default:
          throw new HttpError(statusCode, message);
      }
    }

    if (statusCode >= 500) {
      throw new ServerError(message);
    }

    throw new HttpError(statusCode, message);
  }

  static handle(err: any): never {
    if (err?.response) {
      const { status, data } = err.response;
      const message = data?.resp_msg || err.message || "Unexpected error";
      const payload = data ?? null;
      this.handleResponseError(status, message, payload);
    }

    if (err?.statusCode && typeof err.statusCode === "number") {
      const message = err.message || "Unexpected error";
      this.handleStatusCodeError(err.statusCode, message);
    }

    if (err instanceof HttpError) {
      throw err;
    }

    throw new ServerError(err?.message || "Internal server error");
  }
}
