module.exports = (mongoose) => {
  const Message = mongoose.model(
    "Message",
    mongoose.Schema(
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        recipient_type: {
          type: String,
          enum: ["group", "user"],
        },
        receiver: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "recipient_type",
        },
        message: {
          type: String,
        },
        read: {
          type: Boolean,
          default: false,
        },
        created_at: {
          type: Date,
          default: Date.now,
        },
      },
      { timestamps: true }
    )
  );

  return Message;
};
