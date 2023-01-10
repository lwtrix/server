import express from "express";
import { getTasks, writeTasks } from "../../utils/rw-tools.js";
import uniqid from "uniqid";
import { checkTaskSchema, triggerBadReq } from "./schema.js";

const tasksRouter = express.Router();

tasksRouter.post("/:plannerId/tasks", checkTaskSchema, triggerBadReq, async (req, res, next) => {
  const tasks = await getTasks();
  const { plannerId } = req.params;

  const newTask = {
    ...req.body,
    id: uniqid(),
    plannerId: plannerId,
    createdAt: new Date(),
  };
  tasks.push(newTask);
  await writeTasks(tasks);

  res.send(newTask).status(201);
});

tasksRouter.get("/:plannerId/tasks", async (req, res, next) => {
  const tasks = await getTasks();
  const { plannerId } = req.params;

  const foundTasks = tasks.filter((task) => task.plannerId === plannerId);

  res.send(foundTasks);
});

tasksRouter.get("/:plannerId/tasks/:id", async (req, res, next) => {
  const tasks = await getTasks();
  const { plannerId, id } = req.params;

  const foundTask = tasks.find(
    (task) => task.plannerId === plannerId && task.id === id
  );

  res.send(foundTask);
});

tasksRouter.put("/:plannerId/tasks/:id", async (req, res, next) => {
  const tasks = await getTasks();
  const { plannerId, id } = req.params;

  const taskIndex = tasks.findIndex(
    (task) => task.plannerId === plannerId && task.id === id
  );

  const currentTask = tasks[taskIndex];
  const updatedTask = { ...currentTask, ...req.body, updatedAt: new Date() };
  tasks[taskIndex] = updatedTask;

  await writeTasks(tasks);

  res.send(updatedTask);
});

tasksRouter.delete("/:plannerId/tasks/:id", async (req, res, next) => {
  const tasks = await getTasks();
  const { plannerId, id } = req.params;

  const updatedTasks = tasks.filter(
    (task) => task.id !== id && task.plannerId !== plannerId
  );

  await writeTasks(updatedTasks);

  res.send().status(204);
});

export default tasksRouter;
