const db = require("./App/Models");
const User = db.users;
const Message = db.messages;
const Group = db.groups;
const GroupMember = db.groupmembers;

module.exports = Socket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let users = [];

  io.on("connection", (sockect) => {
    sockect.on("connected", (userID) => {
      users[userID] = sockect.id;
      console.log(users);
    });

    sockect.on("typing", (data) => {
      // console.log(data);
      if (users[data.receiver]) {
        io.to(users[data.receiver]).emit("typing", "typing");
        // console.log('type')
      }
    });

    sockect.on("read", (msgRead) => {
      console.log(msgRead);
      try {
        Chat.updateMany(
          { receiver: msgRead.receiver, isRead: false },
          { $set: { isRead: true } },
          (error, result) => {
            User.find({ _id: msgRead.receiver })
              .populate({
                path: "chats",
                populate: [
                  {
                    path: "sender",
                    model: "users",
                  },
                  {
                    path: "receiver",
                    model: "users",
                  },
                ],
                populate: {
                  path: "lastMessage",
                  model: "chats",
                },
                model: "chats",
                match: {
                  $or: [
                    { sender: msgRead.sender, receiver: msgRead.receiver },
                    { sender: msgRead.receiver, receiver: msgRead.sender },
                  ],
                },
              })

              .exec((error, chat) => {
                console.log(chat);
                if (error) {
                  console.log(error);
                }

                console.log("emited");

                io.to(msgRead.receiver).emit("mesRec", chat);
                io.to(msgRead.sender).emit("mesRec", chat);
              });
          }
        );
      } catch (error) {
        next(error);
      }
    });

    sockect.on("send", async (data) => {
      try {
        console.log(users);
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
              })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize);

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
                  .sort({ createdAt: -1 })
                  .skip(skip)
                  .limit(pageSize);
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
            message.save(message).then(async (response) => {
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
              })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize);

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
                  .sort({ createdAt: -1 })
                  .skip(skip)
                  .limit(pageSize);
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
              console.log(otherUser._id + " other");
              io.to(users[user._id]).emit("mesRec", messages);
              io.to(users[otherUser._id]).emit("mesRec", messages);
            });
          }
        }
      } catch (error) {
        console.log(error);
      }

      // const otherUser = await User.find({ _id: data.receiver });

      // if (otherUser.length > 0) {
      //   const me = await User.find({ _id: data.sender });

      //   if (me.length > 0) {
      //     var message =
      //       "Message from " + me[0].name + " message: " + data.message;

      //     const chat = new Chat({
      //       sender: data.sender,
      //       receiver: data.receiver,
      //       message: data.message,
      //     });

      //     chat
      //       .save(chat)
      //       .then(async (sent) => {
      //         User.findOneAndUpdate(
      //           { _id: me[0]._id },
      //           { $push: { chats: sent._id }, $set: { lastMessage: sent._id } },
      //           (error) => {
      //             if (error) return console.error(error);

      //             User.findOneAndUpdate(
      //               { _id: otherUser[0]._id },
      //               {
      //                 $push: { chats: sent._id },
      //                 $set: { lastMessage: sent._id },
      //               },
      //               (error) => {
      //                 if (error) return console.error(error);

      //                 console.log("Users updated successfully");

      //                 User.find({ _id: me[0]._id })
      //                   .populate({
      //                     path: "chats",
      //                     populate: [
      //                       {
      //                         path: "sender",
      //                         model: "users",
      //                       },
      //                       {
      //                         path: "receiver",
      //                         model: "users",
      //                       },
      //                     ],
      //                     model: "chats",
      //                     match: {
      //                       $or: [
      //                         { sender: me[0]._id, receiver: otherUser[0]._id },
      //                         { sender: otherUser[0]._id, receiver: me[0]._id },
      //                       ],
      //                     },
      //                   })

      //                   .exec((error, chat) => {
      //                     console.log(chat);
      //                     if (error) {
      //                       console.log(error);
      //                     }

      //                     console.log("emited");

      //                     io.to(users[otherUser[0]._id]).emit("mesRec", chat);
      //                     io.to(users[me[0]._id]).emit("mesRec", chat);
      //                   });
      //               }
      //             );
      //           }
      //         );
      //       })
      //       .catch((error) => {
      //         console.log(error);
      //         // res.status(400).json({ error: "Message did not send", data: error });
      //       });
      //   }
      // }
    });
  });
};
