# Chatroom React Exercise
Exercise for [React Workshop](https://docs.google.com/presentation/d/1Y1E6xCX884fZfn6qB9mglNIgRh5-IEw9R5cpl6xQCNI/edit?usp=sharing).

## Exercise
Create a chatroom client using [React](https://facebook.github.io/react/). The client needs to support the following operations:
* Login using specified user name
* Display list of connected users
* Display received messages
* Send message to everybody
* Optional: send message to specific user
* Logout

## Chatroom server
app.js implements a simple chatroom server using [Socket.io](http://socket.io/). It supports a single chatroom without limits on number of participants.

```
node app.js
```

Default port is 8088. Use -p or --port on the command-line to specify an alternate port.

The chatroom servers doubles as a static file HTTP server, that can be used to deliver the HTML and JavaScript files.

## Client-side API
chatClient.js implements a simple client-side API for the chatroom server, on top of Socket.io. It provides the following API:

### Methods
* **ChatRoom** constructor (with the *new* operator) - use to create a new chatroom client instance. A single argument is required, which is the URL of the chatroom server.
If the chatroom server is also the webserver, you can use location.host for this argument

```javascript
var chatRoom = new ChatRoom(location.host);
```

* **login** given a username, logs that user into the chatroom. The user will be able to send messages to all other users.
Note that the username **need not** be unique.

```javascript
var chatRoom = new ChatRoom(location.host);
chatroom.login('Dan');
```

**Note:** preferably the login method should not be invoked before the *onConnect* notification is received.

* **logout** disconnects a logged in session. If session isn't logged in then this method has not effect.

* **send** send a text message to all other users or to a specific user.

```javascript
var chatRoom = new ChatRoom(location.host);
...
chatRoom.send('Hello world!'); // send to all other users
```

or

```javascript
var chatRoom = new ChatRoom(location.host);
...
chatRoom.send('Hello world!', to); // send to specific user
```

*to* specifies the recipient of the message. It can be either the numeric id of the recipient, or an object having an *id* field.

### Events
* *onConnect* is fired when a connection is established between the client and the server.
The client is not logged in yet, and can't sends messages, but will receive messages and notifications about users.
The event receives a single argument, which is the unique numeric id of the client.

* *onMessage* is fired when a message is received by the client. The event receives three arguments