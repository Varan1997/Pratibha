import Student from '../models/Student.js';
import { syncParentAccount } from '../utils/syncParentAccount.js';

const syncParentAccountSafely = async (student) => {
  try {
    await syncParentAccount(student);
  } catch (err) {
    console.error('Failed to sync parent account:', err.message);
  }
};

export const listStudents = async (req, res, next) => {
  try {
    const { classId, status, search } = req.query;
    const filter = {};

    if (classId) filter.class = classId;
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const students = await Student.find(filter).populate('class', 'name section academicYear').sort({ name: 1 });
    res.json(students);
  } catch (err) {
    next(err);
  }
};

export const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('class', 'name section academicYear');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    await syncParentAccountSafely(student);
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await syncParentAccountSafely(student);
    res.json(student);
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    next(err);
  }
};
