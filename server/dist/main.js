"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var io = require("socket.io");
var http = require("http");
var ejs = require("ejs");
var settings = require("./settings");
var app = express();
var server = new http.Server(app);
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', settings.VIEWS_DIR);
// setup static folder path
// example usage : http://localhost:3000/dist/images/kitten.jpg
app.use('/dist', express.static(settings.CLIENT_DIR));
app.get('/', function getAppShell(req, res) {
    res.render('index');
});
var NAMESPACE = {
    TEST: '/test'
};
function openTestConnection() {
    var socket = io(server).of('/test');
    socket.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
}
openTestConnection();
server.listen(9999);
console.log('Snakepvp server running at:');
console.dir(server.address());
