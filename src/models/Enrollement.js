const EnrollmentModel = require("../schema/enrollmentSchema");
const createEnrollment = async (data) => {
  const newEnrollment = new EnrollmentModel(data);
  const createdEnrollment = await newEnrollment.save();
  return createdEnrollment;
};
const getEnrollmentsByBatchAndTeacher = async (batchId, teacherId) => {
  const enrollments = await EnrollmentModel.aggregate([
    { $match: { batchId, teacherId } },
    {
      $lookup: {
        from: "studentaccounts", // Collection name in MongoDB
        localField: "studentId",
        foreignField: "studentId",
        as: "studentDetails",
      },
    },
    { $unwind: "$studentDetails" }, // Flatten the array resulting from $lookup
  ]);
  return enrollments;
};



const updateEnrollmentStatus = async (enrollmentId, status) => {
  const enrollment = await EnrollmentModel.findOne({ enrollmentId });
  console.log("enrollment", enrollment);
  enrollment.status = status;
  await enrollment.save();
  return enrollment;
};
const getEnrollmentBySTudentId = async (studentId) => {
  const enrollments = await EnrollmentModel.aggregate([
    {
      $match: { studentId: studentId },
    },
    {
      $lookup: {
        from: "teacheraccounts",
        localField: "teacherId",
        foreignField: "teacherId",
        as: "teacherInfo",
      },
    },
    {
      $unwind: "$teacherInfo",
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: 'batches',
        localField: 'batchId',
        foreignField: 'batchId',
        as: 'batchInfo'
      }
    },
    {
      $unwind: '$batchInfo'
    },
    {
      $project: {
        _id: 0,
        teacherId: 0,
        batchId: 0,
      },
    },
  ]);
  const count = await EnrollmentModel.countDocuments({ studentId: studentId });

  return { enrollments, count };
};


// teacher enrollment
const getEnrollmentByTeacherId = async (teacherId) => {
  const enrollments = await EnrollmentModel.aggregate([
    {
      $match: { teacherId: teacherId },
    },
    {
      $lookup: {
        from: "studentaccounts",
        localField: "studentId",
        foreignField: "studentId",
        as: "studentInfo",
      },
    },
    {
      $unwind: "$studentInfo",
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: 'batches',
        localField: 'batchId',
        foreignField: 'batchId',
        as: 'batchInfo'
      }
    },
    {
      $unwind: '$batchInfo'
    },
    {
      $project: {
        _id: 0,
        studentId: 0,
        batchId: 0,
      },
    },
  ]);
  return enrollments;
};


const getStudentDetailsByBatchId = async (batchId) => {
  const enrollments=await EnrollmentModel.aggregate([
    { $match: { batchId: batchId } },
    {
      $lookup: {
        from: 'studentaccounts',
        localField: 'studentId',
        foreignField: 'studentId',
        as: 'studentDetails'
      }
    },
    { $unwind: '$studentDetails' },
    {
      $lookup: {
        from: 'batches',
        localField: 'batchId',
        foreignField: 'batchId',
        as: 'batchDetails'
      }
    },
    { $unwind: '$batchDetails' },
    {
      $project: {
        _id: 0,
        studentId:0,
        batchId:0,
      }
    }
  ]);
  return enrollments
};


const studentPendingEnrollment = async (studentId) => {
  const results = await EnrollmentModel.find({ studentId: studentId, status: "pending" }).exec();
  return results;
};
const studentApprovedEnrollment = async (studentId) => {
  const results = await EnrollmentModel.find({ studentId: studentId, status: "approved" }).exec();
  return results;
};
const studentRejectEnrollment = async (studentId) => {
  const results = await EnrollmentModel.find({ studentId: studentId, status: "reject" }).exec();
  return results;
};

const getEnrolledTeachersByStudentId = async (studentId) => {
  try {
    const enrolledTeachers = await EnrollmentModel.aggregate([
      { $match: { studentId: studentId } },
      { $lookup: {
        from: 'teacheraccounts',
        localField: 'teacherId',
        foreignField: 'teacherId',
        as: 'teacher'
      } },
      { $unwind: '$teacher' },
      { $project: {
        _id: 1,
        teacherId:0
        // name: 1,
        // email: 1,
        // phone: 1,
        // address: 1,
        // gender: 1,
        // degree: 1,
        // expert: 1,
        // experience: 1,
        // fees: 1,
        // versityName: 1,
        // image: 1,
        // bio: 1
      } }
    ]);
    return enrolledTeachers;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  createEnrollment,
  getEnrollmentsByBatchAndTeacher,
  updateEnrollmentStatus,
  getEnrollmentBySTudentId,
  getEnrollmentByTeacherId,
  getStudentDetailsByBatchId,
  studentPendingEnrollment,
  studentApprovedEnrollment,
  studentRejectEnrollment,
  getEnrolledTeachersByStudentId
};
