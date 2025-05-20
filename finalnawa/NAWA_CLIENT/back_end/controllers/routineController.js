const Routine = require('../models/Routine');
const Teacher = require('../models/Teacher');

// Update routine
exports.updateRoutine = async (req, res) => {
  try {
    const { teacherId, day, period, subject, class: className } = req.body;
    
    const routine = await Routine.findOneAndUpdate(
      { teacher: teacherId, day, period },
      { subject, class: className },
      { new: true }
    );

    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    res.json(routine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 