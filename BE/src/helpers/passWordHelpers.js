const bcrypt = require("bcryptjs");
exports.hashPassword = async (password, salt) => {
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

exports.comparePassword = async (password, hash) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
