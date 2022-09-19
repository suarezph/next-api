import { compare, hash } from 'bcrypt';

export async function hashPassword(password: string) {
  const salt = 10;
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
