const constants = require('./utility/constants.js');

// required libraries
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

// initiate express middleware
const app = express();
const router = express.Router();

const serverPort = 3210;
const sqlPort = 3001;

// use these configurations to run
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use("/api", router);

const weather_DB_connection = mysql.createConnection({
   host: "192.168.1.130",
   port: sqlPort,
   user: "ADMIN",
   password: "ADMINROOTPASSWORD",
   database: "WeatherAppV2Data"
});

router.get("/", function(request, response) {
    response.send(constants.resultSuccess);
    console.log("Pinged GET /api/");

    return new Promise(function(resolve, reject) {
        let query = "SELECT * FROM WEATHER_FOR_TIME";
        weather_DB_connection.query(query, function(err, result, fields) {
            if (err) {
                throw err;
            } else {
                let resultArray = JSON.parse(JSON.stringify(result));
                let lastEntry = resultArray[resultArray.length - 1];

                resolve(lastEntry);
            }
        });
    });
});

router.put("/submitweather", function(request, response) {
    let data = request.body;
    let query = "INSERT INTO WEATHER_FOR_TIME VALUES ("
        + data.time + ", "
        + data.location.latitude + ", "
        + data.location.longitude +  ", "
        + data.temperature +  ", "
        + data.precipitationProbability +  ", "
        + data.humidity +  ", "
        + data.windSpeed +  ", "
        + data.windBearing + ")";

    weather_DB_connection.query(query, function(error, result) {
        if (error) {
            console.log(error);
            response.send(constants.resultFailure);
        } else {
            console.log("Weather entry recorded successfully! " + query.substring(36));
            response.send(constants.resultSuccess);
        }
    });
});

app.listen(serverPort, function() {
    console.log("Server listening on port " + serverPort + "...");
});
