import { throwValidationError } from "./error";

type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: any };

type SchemaLike<T> = {
  safeParse: (data: unknown) => SafeParseResult<T>;
};

export const validateOrThrow = <T>(schema: SchemaLike<T>, data: unknown): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors as Record<
      string,
      string[]
    >;
    throwValidationError(fieldErrors);
  }

  return (result as { success: true; data: T }).data;
};
