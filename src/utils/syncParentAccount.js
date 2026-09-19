import User from '../models/User.js';

// Ensures a parent User account exists for a student's contact number and
// that this student is linked to it. Called after a student is created or
// updated; failures here should never block the student write itself.
export const syncParentAccount = async (student) => {
  const { contactNumber, parentName, _id } = student;
  if (!contactNumber) return;

  const parent = await User.findOne({ role: 'parent', phone: contactNumber });

  if (parent) {
    if (!parent.children.some((childId) => childId.toString() === _id.toString())) {
      parent.children.push(_id);
      await parent.save();
    }
    return;
  }

  await User.create({
    name: parentName || 'Parent',
    role: 'parent',
    phone: contactNumber,
    children: [_id],
  });
};
