import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { ZodError } from "zod";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use("/api", router);

app.use(
  (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof ZodError) {
      req.log?.warn({ issues: (err as ZodError).issues }, "Validation error");
      res.status(400).json({ ok: false, issues: (err as ZodError).issues });
      return;
    }
    req.log?.error({ err }, "Unhandled error");
    res.status(500).json({ ok: false });
  },
);

export default app;
