import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
export const allowedIPs = [
  "192.168.56.1",
  "192.168.0.178",
  "192.168.75.70",
  "192.168.0.187",
  "192.168.49.13",
  "192.168.0.1",
];

export const formatDataToSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return {
    access_token,
    username: user.username,
  };
};

// regex for email validation
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

export const hashPassword = async ({ password, salt = 10 }) => {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
