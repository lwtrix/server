import express from "express";
import uniqid from "uniqid";
import {pipeline} from 'stream'
import getPDFReadableStream from "../../utils/pdf-tools.js";
import { getPlanners, getTasks, writePlanners, writeTasks } from "../../utils/rw-tools.js";
import { checkPlannerSchema, triggerBadReq } from "./schema.js";

const plannersRouter = express.Router();

plannersRouter.post("/", checkPlannerSchema, triggerBadReq, async (req, res, next) => {
  try {
    const planners = await getPlanners();

    const newPlanner = { ...req.body, id: uniqid(), createdAt: new Date() };
    planners.push(newPlanner);
  
    await writePlanners(planners);
    res.send(newPlanner).status(201);
  } catch (error) {
      next(error)
  }
});
plannersRouter.get("/", async (req, res, next) => {
  const planners = await getPlanners();

  res.send(planners);
});

plannersRouter.get("/:id", async (req, res, next) => {
  const planners = await getPlanners();
  const { id } = req.params;

  const foundPlanner = planners.find((plan) => plan.id === id);
  res.send(foundPlanner);
});
plannersRouter.put("/:id", async (req, res, next) => {
  const planners = await getPlanners();
  const { id } = req.params;

  const plannerIndex = planners.findIndex((plan) => plan.id === id);

  const foundPlanner = planners[plannerIndex];
  const updatedPlanner = {
    ...foundPlanner,
    ...req.body,
    updatedAt: new Date(),
  };

  planners[plannerIndex] = updatedPlanner;
  await writePlanners(planners);

  res.send(updatedPlanner);
});
plannersRouter.delete("/:id", async (req, res, next) => {
  const planners = await getPlanners();
  const tasks = await getTasks()
  const { id } = req.params;

  const updatedPlanners = planners.filter((plan) => plan.id !== id);
  const updatedTasks = tasks.filter(task => task.plannerId !== id)

  await writePlanners(updatedPlanners);
  await writeTasks(updatedTasks)
  
  res.send().status(204);
});

plannersRouter.get('/:id/pdf', async (req, res, next) => {
  const { id } = req.params

  const planners = await getPlanners()
  const foundPlanner = planners.find(plan => plan.id === id)
  const tasks = await getTasks()
  const foundPlannerTasks = tasks.filter(task => task.plannerId === id)
  
  if(foundPlanner && foundPlannerTasks) {
    const plannerData = {
      plannerName: foundPlanner.name,
      plannerTasks: foundPlannerTasks
    }
  
    res.setHeader("Content-Disposition", "attachment; filename=test.pdf")
    const source = getPDFReadableStream(plannerData)
    const destination = res
  
    pipeline(source, destination, err => {
      if(err) console.log(err)
    })
  }
  
})  

export default plannersRouter;
