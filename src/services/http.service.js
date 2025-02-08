const __response = (payload, status) => {
    const success = [200,201].includes(status);
    let response = {
        success,
        status
    };
    if(success){
        response.payload = payload;
    }else{
        response.errors = payload;
    }
    return response;
}
export default __response;