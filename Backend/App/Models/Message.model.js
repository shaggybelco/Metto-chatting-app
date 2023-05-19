module.exports = (mongoose) => {
  const Message = mongoose.model(
    "Message",
    mongoose.Schema(
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          select: "_id name cellphone isAvatar avatar"
        },
        recipient_type: {
          type: String,
          enum: ["group", "user"],
        },
        receiver: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "recipient_type",
          select: "_id name cellphone isAvatar avatar"
        },
        message: {
          type: String,
        },
        read: {
          type: Boolean,
          default: false,
        },
        isFile: {
          type: Boolean,
          default: false,
        },
        file: {
          type: String,
          default: "",
        },
        deletedBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
      { timestamps: true }
    )
  );

  return Message;
};
