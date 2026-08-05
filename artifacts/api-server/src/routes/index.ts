import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import postsRouter from "./posts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(postsRouter);

export default router;
