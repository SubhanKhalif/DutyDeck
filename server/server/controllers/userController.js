const User = require('../models/User.js');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'user' }).select("name email organization");
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllEmployees };
