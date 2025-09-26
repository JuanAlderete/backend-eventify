import mongoose from "mongoose";
import bcrypt from "bcrypt";

const validateEmail = function (email: string) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updated_at: {
    type: Date,
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
});

usersSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});

usersSchema.post("save", async function (user) {
  if (user.isNew) {
    console.log("New user created:", user);
  } else {
    console.log("User updated:", user);
  }
});

const Users = mongoose.model("Users", usersSchema);

export default Users;
