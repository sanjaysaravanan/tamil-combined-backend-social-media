import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
  },
  {
    timestamps: true,
  }
);

// Compile the schema into a model
const User = mongoose.model("User", userSchema);

export { User };
