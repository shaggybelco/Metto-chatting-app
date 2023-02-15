module.exports = (mongoose) => {
  const GroupMember = mongoose.model(
    "groupmember",
    mongoose.Schema({
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    })
  );
  return GroupMember;
};
