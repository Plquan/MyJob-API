export class HttpException extends Error {
  status: number;
  errorCode: number;
  constructor(status: number,errorCode: number, message: string) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}