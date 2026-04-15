import { GraphQLError } from "graphql";

export const throwValidationError = (fieldErrors: Record<string, string[]>) => {
  throw new GraphQLError("Validation failed", {
    extensions: {
      code: "BAD_USER_INPUT",
      fieldErrors,
    },
  });
};

export const throwAuthError = (message: string) => {
  throw new GraphQLError(message, {
    extensions: {
      code: "UNAUTHORIZED",
    },
  });
};

export const throwNotFoundError = (message: string) => {
  throw new GraphQLError(message, {
    extensions: {
      code: "NOT_FOUND",
    },
  });
};

export const throwServerError = (message: string = "Something went wrong") => {
  throw new GraphQLError(message, {
    extensions: {
      code: "INTERNAL_SERVER_ERROR",
    },
  });
};

export const throwInputError = (message: string): never => {
  throw new GraphQLError(message, {
    extensions: {
      code: "BAD_USER_INPUT",
    },
  });
};

export const handleServiceError = (error: unknown): never => {
  console.error("handleServiceError caught:", error);
  if (error instanceof GraphQLError) throw error;
  return throwServerError(); // ← add return
};
