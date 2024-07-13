const Task = require("../models/Task");

const io = require("socket.io")({
  cors: {
    origin: "*",
  },
});

// const clientStore = new DataStore({
//   path: `${path.join(__dirname)}/store/data.json`,
// });

io.on("connection", function (socket) {
  // console.log(`${socket.id} is connected`);
  socket.on("open-connection-pool", async (data) => {
    console.log("open-connection-pool", socket.id);
    try {
      console.log("open-connection-pool", data);
      const { senderId } = data;
      socket.join(senderId);
      io.to(senderId).emit("connection-pool-established", {
        data: `Connection is established with Socket : ${socket.id}`,
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("collaboration-pool-request", async (data) => {
    try {
      console.log("collaboration-pool-request", data);
      const { creatorId, creatorName, taskId, taskName, collaboratorId } = data;
      let responseData = {
        creatorId,
        collaboratorId,
        taskId,
        socketNotificationMessage: `${creatorName} wants to collaborate with you for ${taskName} task.`,
      };
      console.log("collaboration-pool-response", responseData);
      io.to(collaboratorId.toString()).emit(
        "collaboration-pool-response",
        responseData
      );
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("task-modification-request", async (data) => {
    try {
      console.log("task-modification-request", data);
      const { creatorId, taskId } = data;
      const taskDetails = await Task.findById(taskId);
      if (taskDetails && taskDetails !== null) {
        console.log("🚀 ~ socket.on ~ taskDetails:", taskDetails);
        let responseData = {
          creatorId,
          taskId,
          socketNotificationMessage: `You have an update for this Task : "${taskDetails.name}"`,
        };
        if (taskDetails && taskDetails?.collaborators?.length) {
          taskDetails?.collaborators?.forEach((collaboratorId) => {
            console.log("task-modification-response", responseData);
            responseData.collaboratorId = collaboratorId.toString();
            io.to(collaboratorId.toString()).emit(
              "task-modification-response",
              responseData
            );
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
});

exports.pool = (data) => {
  socket.on("open-connection-pool", async (data) => {
    console.log("open-connection-pool", socket.id);
    try {
      console.log("open-connection-pool", data);
      const { senderId } = data;
      socket.join(senderId);
      io.to(senderId).emit("connection-pool-established", {
        data: `Connection is established with Socket : ${socket.id}`,
      });
    } catch (error) {
      console.log(error);
    }
  });
};
module.exports = io;
