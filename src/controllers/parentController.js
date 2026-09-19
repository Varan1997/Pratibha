import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

export const listMyChildren = async (req, res, next) => {
  try {
    const children = await Student.find({ _id: { $in: req.user.children } }).populate(
      'class',
      'name section academicYear'
    );
    res.json(children);
  } catch (err) {
    next(err);
  }
};

const assertOwnChild = (req, childId) => {
  return req.user.children.some((id) => id.toString() === childId);
};

export const getChildAttendance = async (req, res, next) => {
  try {
    const { childId } = req.params;

    if (!assertOwnChild(req, childId)) {
      return res.status(403).json({ message: 'Not authorized to view this student' });
    }

    const records = await Attendance.find({ personType: 'Student', person: childId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    next(err);
  }
};
