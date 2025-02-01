import express from "express";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import fs from "fs";
import {
    __volumes
} from "./services/files.service.js"
let APP_PORT = 8080;
const APP_URL = `http://localhost:${APP_PORT}`;

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

import swaggerUi from "swagger-ui-express"

const swaggerDocument = fs.readFileSync(__volumes + '/swagger.json');

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/products",productRouter)
app.use("/api/carts",cartRouter)

app.get("/time",(request, response) => {
    response.send(JSON.stringify({
        "time" : (new Date).toTimeString()
    }));
});
app.listen(APP_PORT, () => {
    console.log(`started at ${APP_URL}`);
}); 
export default app;