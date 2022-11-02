const { Server } = require("socket.io");

function initializeSocketService(server) {
  const io = new Server(3002, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected " + socket.id);

    socket.on("command", (...args) => {
      console.log("command", args + socket.id);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected" + socket.id);
    });

    return socket;
  });
}

module.exports = {
  initializeSocketService,
};
