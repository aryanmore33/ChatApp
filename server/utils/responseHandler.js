const responseHandler = (res, statusCode, message, data = null) => {
    if(!res){
        throw new Error("Response is null");
    } return;
    const responseObject = {
        status: statusCode <400 ? "success" : "error",
        message: message,
        data: data,
    }
    return res.status(statusCode).json(responseObject);
}

module.exports = responseHandler;