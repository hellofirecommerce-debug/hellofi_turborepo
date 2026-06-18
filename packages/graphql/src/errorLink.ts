import { onError } from "@apollo/client/link/error";
import { toast } from "sonner";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

export function createErrorLink(silentOperations: string[] = []) {
  return onError(({ error, operation }) => {
    if (
      operation.operationName &&
      silentOperations.includes(operation.operationName)
    )
      return;

    if (CombinedGraphQLErrors.is(error)) {
      error.errors.forEach((err) => {
        const fieldErrors = err.extensions?.fieldErrors as
          | Record<string, string[]>
          | undefined;

        if (fieldErrors && Object.keys(fieldErrors).length > 0) {
          Object.values(fieldErrors).forEach((arr) => {
            arr.forEach((msg) => toast.error(msg));
          });
        } else {
          toast.error(err.message);
        }
      });
      return;
    }

    toast.error("Something went wrong");
  });
}
