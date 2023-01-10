import { checkSchema, validationResult } from "express-validator";
import createHttpError from 'http-errors'

const plannerSchema = {
    name: {
        in: ["body"],
        isString: {
            errorMessage: "Planner name is required and must be a string"
        }
    }
}

export const checkPlannerSchema = checkSchema(plannerSchema)

export const triggerBadReq = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        next(createHttpError(400, "Error with planner data validation", { errors: errors.array()}))
    } else {
        next()
    }
}