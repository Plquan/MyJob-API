 class HttpException extends Error {
  public status: number;
  public errors?: any;

  constructor(status: number, message: string, errors?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;

    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  getError() {
    return {
      statusCode: this.status,
      errorMessage: this.message,
      errors: this.errors ?? null,
    };
  }
}
export default HttpException