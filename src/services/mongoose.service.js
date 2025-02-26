import mongoose from "mongoose";

const buildString = () => {
    const user  = process.env.MONGO_DB_USERNAME || null,
        pass    = process.env.MONGO_DB_PASS || null,
        host    = process.env.MONGO_DB_HOST || null,
        port    = process.env.MONGO_DB_PORT || null,
        name    = process.env.MONGO_DB_NAME || null,
        cluster = process.env.MONGO_DB_CLUSTER || null;
    let string = process.env.MONGO_DB_STRING || null;
    if(string === null){
        string  = port !== null ? "mongodb://" : "mongodb+srv://"; 
        string += user !== null && pass !== null ? `${user}:${pass}` : '';
        string += `@${host}`;
        string += port !== null ? `:${port}` : '';
        string += '/';
        string += name !== null ? name : '';
        string += `?retryWrites=true&w=majority`;
        string += cluster !== null ? `&appName=${cluster}` : '';
    }
    return string;
}

/**
 * Lets do a foolproof connection guide to forget about this and do everything from env
 * thinking about scalability and microservices creation
 */
const connectionMongoDB = async () => {
    let string = process.env.MONGO_DB_STRING || buildString();
    try{
        const connection = await mongoose.connect(string); 
        console.log(`Connected to mongoose`);
    }catch(error){
        console.error({
            string,
            error 
        }); 
    } 
};

export default connectionMongoDB;  