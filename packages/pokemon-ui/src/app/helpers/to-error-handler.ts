import { ErrorHandler } from "../../helpers/error-handler";

export function toErrorHandler(err: unknown): string {
  if (err instanceof ErrorHandler) return err.message;
  if (err instanceof Error) return new ErrorHandler((err as unknown as { status?: number }).status || 500, err.message).message;
  return 'An unexpected error occurred.';
}