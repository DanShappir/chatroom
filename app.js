/**
 * Created by Dan_Shappir on 7/16/15.
 */
'use strict';

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8088);

function handler(req, res) {
    var url = req.url;
    if (url.indexOf('..') !== -1) {
        res.writeHead(403);
        return res.end('Error accessing resource');
    } else {
        fs.readFile(__dirname + req.url,
            function (err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading resource');
                }
                res.writeHead(200);
                res.end(data);
            });
    }
}

var clients = (function () {
    var socketToClient = new Map();
    var idToSocket = Object.create(null);
    return {
        add: function (socket, client) {
            socketToClient.set(socket, client);
            idToSocket[client.id] = socket;
        },
        remove: function (socket) {
            var client = socketToClient.get(socket);
            if (client) {
                delete idToSocket[client.id];
                socketToClient.delete(socket);
                return client.id;
            }
        },
        getSocket: function (id) {
            return idToSocket[id];
        },
        list: function () {
            var clients = [];
            socketToClient.forEach(function (client) {
                clients.push(client);
            });
            return {
                clients: clients
            };
        }
    };
}());

var counter = 0;
io.on('connection', function (socket) {
    var client = {
        id: ++counter
    };
    console.log('connection', counter);
    socket.emit('hello', client);

    socket
        .on('login', function (data) {
            console.log('login', client.id, data.name);
            client.name = data.name;
            clients.add(socket, client);
            var list = clients.list();
            socket.emit('update', list);
            socket.broadcast.emit('update', list);
        })
        .on('msg', function(data) {
            var message = {
                from: client,
                message: data.message
            };
            if (data.to) {
                var to = clients.getSocket(data.to.id);
                if (to) {
                    message.personal = true;
                    to.emit('msg', message);
                }
            } else {
                socket.broadcast.emit('msg', message);
            }
            console.log('message', !!message.personal, data.message);
        })
        .on('disconnect', function () {
            var id = clients.remove(socket);
            if (id) {
                console.log('disconnect', id);
                socket.broadcast.emit('update', clients.list());
            }
        });
});
