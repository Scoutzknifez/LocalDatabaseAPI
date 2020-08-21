// required libraries
// required libs
const express = require('express');
const mysql = require('mysql')
const cors = require('cors');
const bodyParser = require('body-parser');

// initiate express middleware
const app = express();
const router = express.Router();

// use these configurations to run on
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use("/api", router);

router.get("/", function(request, response) {
    response.send('{"We":"Are here"}');
});

app.listen(3001, function() {
    console.log("Server listening on port 3001...")
});
