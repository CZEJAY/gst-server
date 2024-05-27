import bcrypt from "bcrypt"

// regex for email validation
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

export const hashPassword = async ({password, salt = 10}) => {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}