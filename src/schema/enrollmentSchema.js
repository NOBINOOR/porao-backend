const mongoose = require('mongoose');
const uuidv4 = require("uuid").v4;
const { getCurrentDateTimeUTCPlus6 } = require("../helper/dateTimeHelpers");
const enrollmentSchema = new mongoose.Schema({
  enrollmentId: {
    type: String,
    default: uuidv4,
    required: true,
  },
  studentId: {
    type: String,
    ref: 'StudentAccount',
    required: true
  },
  teacherId: {
    type: String,
    ref: 'TeacherAccount',
    required: true
  },
  batchId: {
    type: String,
    ref: 'Batch',
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected']
  },
  createdAt: {
    type: Date,
    default: () => getCurrentDateTimeUTCPlus6(),
  },
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
module.exports = Enrollment;