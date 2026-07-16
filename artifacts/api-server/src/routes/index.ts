import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profilesRouter from "./profiles";
import serversRouter from "./servers";
import analyticsRouter from "./analytics";
import memoryRouter from "./memory";
import activityRouter from "./activity";
import billingRouter from "./billing";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/profiles", profilesRouter);
router.use("/servers", serversRouter);
router.use("/analytics", analyticsRouter);
router.use("/memory-nodes", memoryRouter);
router.use("/activity-feed", activityRouter);
router.use("/billing", billingRouter);

export default router;
