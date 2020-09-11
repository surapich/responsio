interface Error {
  message: string;
  stacktrace: string;
}

interface ResponseMessage {
  statusCode?: number;
  responseCode: number;
  message: string;
  errors: Error[];
}
