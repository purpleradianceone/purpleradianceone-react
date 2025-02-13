type ApiError = {
    status? : number,
    response : {
        data?:string,
        status? : number,
        headers : {
            error : string
        }
    }
}

export default ApiError;