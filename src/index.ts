import http from "http";
import express, { NextFunction, Request, Response } from "express";

export interface ResponseError {
  message: string;
  stacktrace: string;
}

export interface ResponseMessage {
  statusCode?: number;
  responseCode?: number;
  message: string;
  errors?: ResponseError[];
}

type StatusCodes = 200 | 201 | 400 | 401 | 403 | 405 | 500 | 502;

declare global {
  namespace Express {
    interface Response {
      respond(data: any): any;
      respond(data: any, resultCode: number): any;
      reject(errors: ResponseError[]): any;
    }
  }

  namespace http {
    interface ServerResponse {
      respond(): any;
    }
  }
}

export function respond(
  response: http.ServerResponse,
  message: ResponseMessage
) {
  response.setHeader("content-type", "application/json");
  if (message.errors && message.errors.length > 0) {
    response.statusCode = message.statusCode || 500;
  }

  if (message.statusCode) {
    delete message.statusCode;
  }

  response.end(JSON.stringify(message));
}

export const expressMiddleware = () => (
  req: Request,
  res: Response,
  next: any
): void => {
  res.respond = (data?: any, resultCode: number = 0): void => {
    if (!data) {
      let error = new Error("Message is empty");

      res.status(502);
      res.send({
        data: null,
        errors: [
          {
            message: error.message,
            stacktrace: error.stack,
          },
        ],
      });
      return;
    }

    res.send({
      result: resultCode,
      data,
    });
    return;
  };

  res.reject = (errors: ResponseError[], statusCode?: number) => {
    res.status(502);
    res.send({
      data: null,
      errors,
    });
    return;
  };

  next && next();
};
