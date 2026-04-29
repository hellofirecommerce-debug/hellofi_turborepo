import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(__dirname, "../.env") });
import express, { Request, Response } from "express";
import { expressMiddleware } from "@as-integrations/express5";
import { graphqlUploadExpress } from "graphql-upload-ts";
import compression from "compression";
// import { graphqlUploadExpress } from "graphql-upload";
import cors from "cors";
import cookieParser from "cookie-parser";
import createApolloGraphqlServer from "./graphql";
import { adminAuthMiddleware } from "./middlewares/adminAuthMiddleware";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 10 }));
  app.use(express.json());
  app.use(cookieParser()); // ← needed for req.cookies to work
  app.use(compression());
  app.use(
    cors({
      origin: [
        process.env.CLIENT_URL!,
        "https://studio.apollographql.com", // ← for playground
        "http://localhost:3001",
        "http://localhost:3000",
        "https://admin.hellofi.in",
      ],
      credentials: true,
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Apollo-Require-Preflight",
        "x-apollo-operation-name",
        "apollo-require-preflight",
      ],
    }),
  ); // ← credentials true for cookies

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use(
    "/graphql",
    adminAuthMiddleware, // sets req.admin if admin token exists
    // userAuthMiddleware, // sets req.user if user token exists
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
  );

  app.listen(PORT, () => console.log("Server is running at PORT:", PORT));
}

init();
