import { mergeTypeDefs } from "@graphql-tools/merge";

import transactionTypeDef from "./transaction.typeDef.js";
import userTypeDef from "./user.typeDefs.js";

const mergedTypeDefs = mergeTypeDefs([transactionTypeDef, userTypeDef]);

export default mergedTypeDefs;