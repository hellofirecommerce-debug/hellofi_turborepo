import { ApolloLink } from "@apollo/client";
import { map } from "rxjs";
import { toast } from "sonner";

const SILENT_OPERATIONS: string[] = [];

export function createErrorLink() {
  return new ApolloLink((operation, forward) => {
    return forward(operation).pipe(
      map((response: any) => {
        const opName = operation.operationName;

        if (opName && SILENT_OPERATIONS.includes(opName)) {
          return response;
        }

        const errors = response?.errors;

        if (Array.isArray(errors) && errors.length > 0) {
          errors.forEach((err: any) => {
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
        }

        return response;
      }),
    );
  });
}
