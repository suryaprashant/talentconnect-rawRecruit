import mongoose from "mongoose";

const basicDetailsSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  profileType: String,
});

export default mongoose.model("BasicDetails", basicDetailsSchema);
