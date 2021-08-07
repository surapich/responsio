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
      respond(resultCode: number, msg: string): any;      
      respond(resultCode: string, msg: string): any;
      respond(resultCode: number, msg: string, data: any): any;
      respond(resultCode: string, msg: string, data: any): any;

      /**
      * @deprecated Since version 1.0. Will be deleted in version 3.0. Use respond instead
      */
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
  res.respond = (
    resultCode: number | string,
    msg: string,
    data?: any
  ): void => {
    // * Construct response message
    let responseMessage = {
      code: resultCode,
      msg,
      data,
    };

    if (!data) {
      delete responseMessage.data;
    }

    res.send(responseMessage);
    return;
  };

  /**
   * @deprecated Since version 1.0. Will be deleted in version 3.0. Use respond instead
   */
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