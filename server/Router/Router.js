const express = require("express");
const {initDatabase, monthData,statisticsData, pagination} = require("../Controlller/controller")


const Router = express.Router()


Router.get("/initdatabase",initDatabase)
Router.get("/api/:month",monthData)
Router.get("/page",pagination)
Router.get("/api/statistics/:month",statisticsData)


module.exports = Router;