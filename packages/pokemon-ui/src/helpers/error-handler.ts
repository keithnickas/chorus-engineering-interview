
/**
 * This class is used to represent errors that occur during API calls or UI 
 * interactions, allowing us to capture both the error message and the 
 * associated HTTP status code.
 */
export class ErrorHandler extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'ErrorHandler';
  }
}
