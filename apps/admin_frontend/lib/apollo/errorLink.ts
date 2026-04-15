import { onError } from "@apollo/client/link/error";
import { toast } from "sonner";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

const SILENT_OPERATIONS = ["AdminMe"];

export const errorLink = onError(({ error, operation }) => {
  // ← skip toast for silent operations
  if (
    operation.operationName &&
    SILENT_OPERATIONS.includes(operation.operationName)
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

  // network / fallback
  toast.error("Something went wrong");
});
