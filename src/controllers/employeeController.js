import Employee from '../models/Employee.js';

export const listEmployees = async (req, res, next) => {
  try {
    const { status, designation, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (designation) filter.designation = designation;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const employees = await Employee.find(filter).sort({ name: 1 });
    res.json(employees);
  } catch (err) {
    next(err);
  }
};

export const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    next(err);
  }
};
