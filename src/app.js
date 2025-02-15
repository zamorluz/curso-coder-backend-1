import fs from "fs";
import express from "express";
import http from "http";
import swaggerUi from "swagger-ui-express";
import {Server} from "socket.io";
import {engine} from "express-handlebars";

import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";

import {__volumes} from "./services/files.service.js"
import Product from "./models/Product.js";

const app = express(),
    server = http.createServer(app),
    port = 8080,
    APP_URL = `http://localhost:${port}`,
    io = new Server(server);

app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars",engine());
app.set("view engine", "handlebars");
app.set("views","src/views");


const swaggerDocument = fs.readFileSync(__volumes + '/swagger.json');
 

app.get("/", (request, response) => {
    response.render("home",{
        title: "Home",
        products : Product.getAll()
    });
})
app.get("/realTimeProducts", (request, response) => {
    response.render("realTimeProducts",{
        title: "realTimeProducts"
    });
})

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/products",productRouter)
app.use("/api/carts",cartRouter)

app.get("/time",(request, response) => {
    response.send(JSON.stringify({
        "time" : (new Date).toTimeString()
    }));
});


io.on("connection", (socket) => {
    console.log(`connection has been made with id ${socket.id}`);
    Product.getAll().forEach(product => socket.emit("product.update", product));
});


app.set('socketio', io);


server.listen(port, () => {
    console.log(`started at ${APP_URL}`);
}); 
export default app;