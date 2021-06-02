const server = require("http").createServer();
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});
let users = [];
const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

io.on("connection", (socket) => {
    console.log('a user connected')
    // Join a conversation
    const { roomId } = socket.handshake.query;
    socket.join(roomId);

    // Listen for new messages
    socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
        io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    });
    socket.on('login',function (data){
    })

    // Leave the room if the user closes the socket
    socket.on("disconnect", () => {
        console.log('user ' + users + ' disconnected');
        socket.leave(roomId);
        delete users[socket.id];
    });
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});