import Class from '../models/Class.js';

export const listClasses = async (req, res, next) => {
  try {
    const classes = await Class.find().populate('classTeacher', 'name designation').sort({ name: 1, section: 1 });
    res.json(classes);
  } catch (err) {
    next(err);
  }
};

export const getClass = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id).populate('classTeacher', 'name designation');
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    res.json(cls);
  } catch (err) {
    next(err);
  }
};

export const createClass = async (req, res, next) => {
  try {
    const cls = await Class.create(req.body);
    res.status(201).json(cls);
  } catch (err) {
    next(err);
  }
};

export const updateClass = async (req, res, next) => {
  try {
    const cls = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    res.json(cls);
  } catch (err) {
    next(err);
  }
};

export const deleteClass = async (req, res, next) => {
  try {
    const cls = await Class.findByIdAndDelete(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    next(err);
  }
};
