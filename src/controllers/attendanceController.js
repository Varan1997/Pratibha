import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

export const markBulkAttendance = async (req, res, next) => {
  try {
    const { date, personType, records } = req.body;

    if (!date || !personType || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'date, personType and records[] are required' });
    }

    const day = new Date(date);

    const operations = records.map(({ person, status, remarks }) => ({
      updateOne: {
        filter: { date: day, personType, person },
        update: {
          $set: {
            status,
            remarks,
            markedBy: req.user._id,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);
    res.status(200).json({ message: 'Attendance saved' });
  } catch (err) {
    next(err);
  }
};

export const listAttendance = async (req, res, next) => {
  try {
    const { date, personType, classId } = req.query;
    const filter = {};

    if (date) filter.date = new Date(date);
    if (personType) filter.personType = personType;

    let records = await Attendance.find(filter).populate('person', 'name admissionNumber employeeCode class');

    if (classId && personType === 'Student') {
      const studentIds = await Student.find({ class: classId }).distinct('_id');
      const idSet = new Set(studentIds.map((id) => id.toString()));
      records = records.filter((r) => idSet.has(r.person?._id?.toString()));
    }

    res.json(records);
  } catch (err) {
    next(err);
  }
};

export const getPersonAttendance = async (req, res, next) => {
  try {
    const { personType, personId } = req.params;
    const records = await Attendance.find({ personType, person: personId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    next(err);
  }
};
