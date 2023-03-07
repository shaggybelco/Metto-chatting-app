module.exports = (mongoose) => {
    const User = mongoose.model(
      "user",
      mongoose.Schema(
        {
          name: String,
          cellphone: { type: String, unique: true, required: true },
          password: { type: String, required: true },
          isAvatar: {
            type: Boolean,
            default: false,
          },
          avatar: {
            type: String,
            default: "",
          },
        },
        { timestamps: true }
      )
    );
  
    return User;
  };