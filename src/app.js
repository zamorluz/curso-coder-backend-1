import fs from "fs";
import express from "express";
import http from "http";
import swaggerUi from "swagger-ui-express";
import {Server} from "socket.io";
import {engine} from "express-handlebars";
import Handlebars from "handlebars";

import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";

import {__volumes} from "./services/files.service.js";
import connectionMongoDB from "./services/mongoose.service.js";
import Product from "./models/Product.model.js";

const app = express(),
    server = http.createServer(app),
    port = 8080,
    APP_URL = `http://localhost:${port}`,
    io = new Server(server);

connectionMongoDB();

app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars",engine());
app.set("view engine", "handlebars");
app.set("views","src/views");


const swaggerDocument = fs.readFileSync(__volumes + '/swagger.json');
 


app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/",viewsRouter);
app.use("/api/products",productRouter);
app.use("/api/carts",cartRouter);

app.get("/time",(request, response) => {
    response.send(JSON.stringify({
        "time" : (new Date).toTimeString()
    }));
});


io.on("connection", async (socket) => {
    console.log(`connection has been made with id ${socket.id}`);
});


app.set('socketio', io);

Handlebars.registerHelper('app_url', () => {
    return process.env.APP_URL;
})

server.listen(port, () => {
    console.log(`started at ${APP_URL}`);
}); 
export default app;