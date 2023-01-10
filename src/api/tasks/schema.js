import { checkSchema, validationResult } from "express-validator";
import createHttpError from 'http-errors'

const taskSchema = {
    content: {
        in: ["body"],
        isString: {
            errorMessage: "Name is required and must be a string"
        }
    }

}

export const checkTaskSchema = checkSchema(taskSchema)

export const triggerBadReq = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        next(createHttpError(400, "Error with product data validation", { errors: errors.array() }))
    } else {
        next()
    }
}