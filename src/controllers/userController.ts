import { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/roles";

interface AuthRequestBody {
  username: string;
  password: string;
  email?: string;
}

interface UpdateRoleRequestBody {
  role: UserRole;
}

interface JwtPayload {
  userId: number;
  role: UserRole;
}

export const registerUser = async (
  req: Request<{}, {}, AuthRequestBody>,
  res: Response
) => {
  try {
    const { username, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(String(password), 5);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email: email as string,
        role: UserRole.User,
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const loginUser = async (
  req: Request<{}, {}, AuthRequestBody>,
  res: Response
) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      String(password),
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const getCurrentUser = async (
  req: Request & { user?: JwtPayload },
  res: Response
) => {
  try {
    const user = req.user as JwtPayload;

    const currentUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { id: true, username: true, email: true, role: true },
    });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(currentUser);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const updateUserRole = async (
  req: Request<{ id: string }, {}, UpdateRoleRequestBody>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user role", error });
  }
};
