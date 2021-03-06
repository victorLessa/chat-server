const SocketServer = require("./socket.js");
const Controller = require("./controller.js");
const { v4 } = require("uuid");
const io = require("socket.io");

const port = process.env.PORT || 9898;
console.log(port);
(async () => {
  const socketServer = new SocketServer(port);
  const server = await socketServer.initialize();

  console.log("Server is running in port " + server.address().port);

  const controller = new Controller({ socketServer });
  io(server).on("connection", async function (socket) {
    socket.id = v4();
    controller.onNewConnection(socket);

    socket.on("joinRoom", await controller.joinRoom(socket.id));
    socket.on("message", controller.message(socket.id));

    socket.on("disconnect", controller.onSocketClosed(socket.id));
  });
})();
