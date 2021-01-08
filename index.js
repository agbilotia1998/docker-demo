let app = require('express')();
let bodyParser = require("body-parser");
let mongoose = require('mongoose');

let serverSchema = new mongoose.Schema({
    url: String,
    port: String,
    healthStatus: String,
    loadMetric: Number
});
let serverModel = new mongoose.model("server", serverSchema);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get("/", () => {
    console.log("Server hit");
})

app.post("/api/server", async (req, res) => {
    try {
        console.log(req);
        if(req != null && req.body != null) {
            let newServer = {
                url: req.body.url,
                port: req.body.port,
                healthStatus: req.body.health,
                loadMetric: 0
            }
            await serverModel.create(newServer);
            res.send({message: "success"}).status(200);
        } else {
            throw new Error("Request Body Empty");
        }
    } catch(error) {
        console.log(error)
    }
});

app.get("/api/server", async (req, res) => {
    try {
        let servers = await serverModel.find({});
        res.send({message: "success", data: servers}).status(200);
    } catch(error) {
        console.log(error)
    }
});

app.get("/initialize", (req, res) => {
    res.send("App Initialized");
});

app.listen(process.env.PORT || 5000, async () => {
    console.log("SERVER STARTED");
    try {
        // await mongoose.connect("mongodb://host.docker.internal:27017/loadbalancer", { useNewUrlParser: true })
        // await mongoose.connect("mongodb://localhost:27017/loadbalancer", { useNewUrlParser: true })
        await mongoose.connect("mongodb://dbContainer:27017/loadbalancer", { useNewUrlParser: true })
        console.log("Connected to DB");
    } catch(error) {
        console.log(error);
    }
})

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongo Connection Closed');
        process.exit(0);
    });
});
