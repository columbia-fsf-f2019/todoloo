const db = require('../models');

const me = async (req, res) => {
  const user = await db.User.findOne({ where: { id: req.auth.user.id } });
  res.send({ user });
};

const login = async (req, res) => {
  const { email: enteredEmail, password: enteredPassword } = req.body;
  const user = await db.User.scope(null).findOne({
    where: { email: enteredEmail },
  });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const isPasswordCorrect = await user.checkPassword(enteredPassword);
  if (!isPasswordCorrect)
    return res.status(400).json({ message: 'Incorrect password' });

  return res.json({ token: user.generateToken(), user });
};

module.exports = {
  login,
  me,
};
