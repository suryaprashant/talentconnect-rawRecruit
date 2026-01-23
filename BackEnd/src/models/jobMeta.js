import mongoose from 'mongoose';

const JobMetaSchema = new mongoose.Schema({
  degree: { type: String, required: true, unique: true },
  streams: [{ type: String }],
  skills: [{ type: String }]
});

// Use "export default" to match your controller import
const JobMeta = mongoose.model('JobMeta', JobMetaSchema);
export default JobMeta;