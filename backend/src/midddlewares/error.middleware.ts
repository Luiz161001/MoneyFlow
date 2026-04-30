const errorMiddleware = (err: any, req: any, res: any, next: any) => {
    try {
        let error = { ...err };
        error.message = err.message;
        console.error(err);

        //create a proper error handling middleware later
    }
    catch(error){
        next(error);
    }
}

export default errorMiddleware;