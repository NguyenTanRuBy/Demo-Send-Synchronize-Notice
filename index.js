const express = require('express');
const app = express();
const path = require('path');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config');

//listen to BLP RabbitMQ
let Receive = require('./AMPQ/receive');

const enviromentName = "dev"
app.use(morgan(enviromentName));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use("/express", express.static(__dirname + "/express"));

// default URL for website
// app.use('/', function(req,res){
//     res.sendFile(path.join(__dirname+'/express/template/index.html'));
//   });

var server = app.listen(config.port, function(){
    console.log("Express server listening on port %d in %s mode", config.port, app.settings.env);
});


module.exports = app;