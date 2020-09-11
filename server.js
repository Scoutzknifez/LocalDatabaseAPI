/*
TEMP IMPORTS
 */
const constants = require('./utility/constants.js');

// required libraries
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

// initiate express middleware
const app = express();
const router = express.Router();

// use these configurations to run
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use("/api", router);

const weather_DB_connection = mysql.createConnection({
   host: "192.168.1.130",
   port: 3210,
   user: "ADMIN",
   password: "ADMINROOTPASSWORD",
   database: "WeatherAppV2Data"
});

router.get("/", function(request, response) {
    response.send('{"We":"Are here"}');
    testGet().then(result => {
        console.log(result[4000]);
    });
});

router.put("/submitweather", function(request, response) {
    var data = request.body;
    var query = "INSERT INTO WEATHER_FOR_TIME VALUES ("
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
            response.send(constants.resultFailure) ;
        } else {
            console.log("Weather entry recorded successfully! " + query.substring(36));
            response.send(constants.resultSuccess);
        }
    });
});

function testGet() {
    return new Promise(function(resolve, reject) {
        var query = "SELECT * FROM WEATHER_FOR_TIME";
        weather_DB_connection.query(query, function(err, result, fields) {
           if (err) {
               throw err;
           } else {
               resolve(JSON.parse(JSON.stringify(result)));
           }
        });
    });
}

app.listen(3001, function() {
    console.log("Server listening on port 3001...")
});
