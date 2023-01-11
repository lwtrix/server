import express from "express";
import createError from "http-errors";
import plannersRouter from "./api/planners/index.js";
import tasksRouter from "./api/tasks/index.js";
import cors from "cors";

const port = process.env.PORT;
const server = express();

const corsWhitelist = [process.env.FE_DEV_ORIGIN, process.env.FE_PROD_ORIGIN]

const corsConfig = {
  origin: (origin, corsNext) => {
    console.log(origin)
    if(!origin || corsWhitelist.indexOf(origin) !== -1) {
        corsNext(null, true)
    } else {
        corsNext(createError(400, 'Origin restricted for this endpoint'))
    }
  },
};

server.use(cors());
server.use(express.json());
server.use("/planners", plannersRouter);
server.use("/planners", tasksRouter);

server.listen(port, () => {
  console.log("Server running on port: ", port);
});
