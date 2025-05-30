/**Custom error handler middleware used to display custom json messages on teriminal */

import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "something went wrong try again later",
    };


    if (err.name === "ValidationError") {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(",");
        customError.statusCode = 400;
    }

    if (err.name === "CastError") {
        CustomAPIError.msg = `No item found with id : ${err.value}`;
        customError.statusCode = 404;
    }
    return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;

// Compare this snippet from Routes/authentication.js: