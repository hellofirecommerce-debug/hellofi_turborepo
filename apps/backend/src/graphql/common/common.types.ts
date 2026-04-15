import { enumTypeDefs } from "./enums/enums.types";
import { scalarTypeDefs } from "./scalars/scalars.types";
import { userTypeDefs } from "./auth/user.types";
import { sessionTypeDefs } from "./auth/session.types";

export const sharedTypeDefs = `#graphql
  ${enumTypeDefs}
  ${scalarTypeDefs}
  ${userTypeDefs}
  ${sessionTypeDefs}
`;
