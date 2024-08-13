import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import prisma from "../prisma/client";

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { username, email, password: hashedPassword, role: 1 },
  });
};

export const authenticateUser = async (
  username: string,
  password: string
): Promise<string | null> => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (user && (await bcrypt.compare(password, user.password))) {
    return jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "2d" }
    );
  }
  return null;
};
