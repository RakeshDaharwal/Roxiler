const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const port = process.env.PORT || 6000;
const router = require("./Router/Router")



const app = express();

app.use(express.json())
app.use(cors())
app.use("/",router)


mongoose.connect("mongodb://127.0.0.1:27017/roxiler").then(() => {
    console.log("database Connected")
})

app.listen(port, () => {
    console.log(`server is running on ${port}`)
})