import { Router, type IRouter } from "express";
import healthRouter from "./health";
import eventsRouter from "./events";
import bkidRouter from "./bkid";
import settingsRouter from "./settings";
import contentRouter from "./content";
import tracksRouter from "./tracks";
import authRouter from "./auth";
import announcementsRouter from "./announcements";
import recruitmentRouter from "./recruitment";
import vaultRouter from "./vault";
import pressRouter from "./press";
import teamRouter from "./team";


const router: IRouter = Router();

router.use(healthRouter);
router.use(eventsRouter);
router.use(bkidRouter);
router.use(settingsRouter);
router.use(contentRouter);
router.use(tracksRouter);
router.use(authRouter);
router.use(announcementsRouter);
router.use(recruitmentRouter);
router.use(vaultRouter);
router.use(pressRouter);
router.use(teamRouter);


export default router;
