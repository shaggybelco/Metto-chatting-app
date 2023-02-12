module.exports = Socket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  let users = [];

  io.on("connection", (sockect) => {
    sockect.on("connected", (userID) => {
      users[userID] = sockect.id;
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
      const otherUser = await User.find({ _id: data.receiver });

      if (otherUser.length > 0) {
        const me = await User.find({ _id: data.sender });

        if (me.length > 0) {
          var message =
            "Message from " + me[0].name + " message: " + data.message;

          const chat = new Chat({
            sender: data.sender,
            receiver: data.receiver,
            message: data.message,
          });

          chat
            .save(chat)
            .then(async (sent) => {
              User.findOneAndUpdate(
                { _id: me[0]._id },
                { $push: { chats: sent._id }, $set: { lastMessage: sent._id } },
                (error) => {
                  if (error) return console.error(error);

                  User.findOneAndUpdate(
                    { _id: otherUser[0]._id },
                    {
                      $push: { chats: sent._id },
                      $set: { lastMessage: sent._id },
                    },
                    (error) => {
                      if (error) return console.error(error);

                      console.log("Users updated successfully");

                      User.find({ _id: me[0]._id })
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
                          model: "chats",
                          match: {
                            $or: [
                              { sender: me[0]._id, receiver: otherUser[0]._id },
                              { sender: otherUser[0]._id, receiver: me[0]._id },
                            ],
                          },
                        })

                        .exec((error, chat) => {
                          console.log(chat);
                          if (error) {
                            console.log(error);
                          }

                          console.log("emited");

                          io.to(users[otherUser[0]._id]).emit("mesRec", chat);
                          io.to(users[me[0]._id]).emit("mesRec", chat);
                        });
                    }
                  );
                }
              );
            })
            .catch((error) => {
              console.log(error);
              // res.status(400).json({ error: "Message did not send", data: error });
            });
        }
      }
    });
  });
};
