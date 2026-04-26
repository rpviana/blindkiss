import { Router, type IRouter } from "express";
import healthRouter from "./health";
import eventsRouter from "./events";
import bkidRouter from "./bkid";
import settingsRouter from "./settings";
import contentRouter from "./content";
import tracksRouter from "./tracks";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(eventsRouter);
router.use(bkidRouter);
router.use(settingsRouter);
router.use(contentRouter);
router.use(tracksRouter);
router.use(authRouter);

export default router;
