module.exports = (mongoose) => {
  const Group = mongoose.model(
    "group",
    mongoose.Schema({
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      isAvatar: {
        type: Boolean,
        default: false,
      },
      avatar: {
        type: String,
        default: "",
      },
    })
  );

  return Group;
};
