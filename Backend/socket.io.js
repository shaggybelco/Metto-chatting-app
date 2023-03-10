const db = require("./App/Models");
const User = db.users;
const Message = db.messages;
const Group = db.groups;
const GroupMember = db.groupmembers;

module.exports = Socket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  let users = [];
  let onlineUsers = {};

  io.on("connection", (socket) => {
    socket.on("connected", (userID) => {
      console.log(userID);
      users[userID] = socket.id;
      onlineUsers[userID] = "online";
      console.log(onlineUsers);

      io.emit("status", { users: Object.keys(onlineUsers) });
    });

    socket.on("disconnect", () => {
      const disconnectedUserID = Object.keys(users).find(
        (key) => users[key] === socket.id
      );

      let offlineUsers = {};

      // console.log(disconnectedUserID);

      if (disconnectedUserID) {
        delete users[disconnectedUserID];
        offlineUsers[disconnectedUserID] = "offline";

        console.log(offlineUsers);
        console.log(users);
        io.emit("status", { users: Object.keys(users) });
      }
    });

    socket.on("typing", (data) => {
      console.log(data);
      if (users[data.receiver]) {
        io.to(users[data.receiver]).emit("typing", data.sender);
        // console.log('type')
      }
    });

    socket.on("msgRead", (messageId, loggedInUser) => {
      console.log(messageId, loggedInUser);
      Message.updateOne(
        { _id: messageId._id, receiver: loggedInUser },
        { read: true },
        (err, result) => {
          if (err) {
            console.log(err);
            return;
          }

          console.log(result);
          io.to(users[loggedInUser]).emit("read", result);
          io.to(users[messageId.receiver._id]).emit("read", result);
        }
      );
    });

    socket.on("send", async (data) => {
      try {
        // console.log(users);
        if (data.recipient_type === "group") {
          const user = await User.findOne({ _id: data.me });
          const otherUser = await Group.findOne({ _id: data.otherId });
          const isMember = await GroupMember.findOne({ user: data.me });

          if (isMember === null) {
            console.log({ error: "user is not a member of this group" });
            return;
          } else if (user === null && otherUser === null) {
            console.log({ error: "user does not exist" });
            return;
          } else {
            const message = new Message({
              sender: user._id,
              receiver: otherUser._id,
              message: data.message,
              recipient_type: data.recipient_type,
              isFile: data.isFile,
              file: data.file,
            });

            let pageSize = 15;
            let page = 1;
            let skip = (page - 1) * pageSize;
            message.save(message).then(async (response) => {
              // console.log(response);
              let messages = await Message.find({
                $or: [
                  {
                    sender: user._id,
                    receiver: otherUser._id,
                  },
                  {
                    sender: otherUser._id,
                    receiver: user._id,
                  },
                ],
              }).sort({ createdAt: -1 });
              // .skip(skip)
              // .limit(pageSize);

              // Check if receiver is a user or a group
              let receiver = await User.findOne({ _id: otherUser._id });
              if (!receiver) {
                // Receiver is a group
                receiver = await Group.findOne({ _id: otherUser._id });
                if (!receiver) {
                  console.log({ message: "Receiver not found" });
                  return;
                }
                messages = await Message.find({
                  receiver: otherUser._id,
                })
                  .populate({
                    path: "receiver",
                    model: "user" | "group",
                  })
                  .sort({ createdAt: -1 });
                // .skip(skip)
                // .limit(pageSize);
              }

              messages = await Promise.all(
                messages.map(async (message) => {
                  const sender = await User.findOne({ _id: message.sender });
                  return {
                    ...message._doc,
                    sender,
                    receiver,
                  };
                })
              );
              console.log("emitted");
              io.to(users[user._id]).emit("mesRec", messages);
              io.to(users[otherUser._id]).emit("mesRec", messages);
            });
          }
        }

        if (data.recipient_type === "user") {
          const user = await User.findOne({ _id: data.me });
          const otherUser = await User.findOne({ _id: data.otherId });
          // console.log({ user, otherUser });

          if (user === null && otherUser === null) {
            console.log({ error: "user does not exist" });
            return;
          } else {
            const message = new Message({
              sender: user._id,
              receiver: otherUser._id,
              message: data.message,
              recipient_type: data.recipient_type,
              isFile: data.isFile,
              file: data.file,
            });

            let pageSize = 15;
            let page = 1;
            let skip = (page - 1) * pageSize;

            message.save(message).then(async (response) => {
              console.log(response);
              let messages = await Message.find({
                $or: [
                  {
                    sender: user._id,
                    receiver: otherUser._id,
                  },
                  {
                    sender: otherUser._id,
                    receiver: user._id,
                  },
                ],
              }).sort({ createdAt: -1 });
              // .skip(skip)
              // .limit(pageSize);

              // Check if receiver is a user or a group
              let receiver = await User.findOne({ _id: otherUser._id });
              if (!receiver) {
                // Receiver is a group
                receiver = await Group.findOne({ _id: otherUser._id });
                if (!receiver) {
                  console.log({ message: "Receiver not found" });
                  return;
                }
                messages = await Message.find({
                  receiver: otherUser._id,
                })
                  .populate({
                    path: "receiver",
                    model: "user" | "group",
                  })
                  .sort({ createdAt: -1 });
                // .skip(skip)
                // .limit(pageSize);
              }

              messages = await Promise.all(
                messages.map(async (message) => {
                  const sender = await User.findOne({ _id: message.sender });
                  return {
                    ...message._doc,
                    sender,
                    receiver,
                  };
                })
              );
              console.log(response);
              io.to(users[user._id]).emit("mesRec", messages);
              io.to(users[otherUser._id]).emit("mesRec", messages);
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
};
