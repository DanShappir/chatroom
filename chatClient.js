/**
 * Created by Dan_Shappir on 7/16/15.
 */
function ChatClient(url) {
    'use strict';

    var socket = io(url);
    this.login = function (name) {
        socket.emit('login', {
            name: name
        });
    };
    this.send = function(message, to) {
        socket.emit('msg', {
            message: message,
            to: typeof to === 'number' ? {id: to} : to
        });
    };
    this.logout = function () {
        socket.disconnect();
    };

    var self = this;
    socket
        .on('disconnect', function () {
            if (self.onDisconnect) {
                self.onDisconnect();
            }
        })
        .on('error', function (err) {
            if (self.onError) {
                self.onError(err);
            }
        })
        .on('hello', function (data) {
            if (self.onConnect) {
                self.onConnect(data.id);
            }
        })
        .on('update', function (data) {
            if (self.onUpdate) {
                self.onUpdate(data.clients);
            }
        })
        .on('msg', function (data) {
            if (self.onMessage) {
                self.onMessage(data.from, data.message, data.personal);
            }
        });
}
