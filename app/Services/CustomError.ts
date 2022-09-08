export class CustomError extends Error {
    extensions: any;
  
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, CustomError.prototype);
    }
  
    getErrorMessage() {
      return 'Something went wrong: ' + this.message;
    }
}
