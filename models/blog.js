const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  author: { type: String, default: "Unknown" },
  title: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

BlogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Blog", BlogSchema);
