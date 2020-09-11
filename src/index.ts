import http from "http";

function respond(response: http.ServerResponse, message: ResponseMessage) {
  response.setHeader("content-type", "application/json");
  if (message.errors && message.errors.length > 0) {
    response.statusCode = message.statusCode || 500;
  }

  if (message.statusCode) {
    delete message.statusCode;
  }

  response.end(JSON.stringify(message));
}

export { respond };
