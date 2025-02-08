import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import {
  comparePasswords,
  createJWT,
  hashPassword,
  verifyJWT,
} from "../helper";
import { secretmanager } from "googleapis/build/src/apis/secretmanager";

const prisma = new PrismaClient();

const setCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  expires: new Date(new Date().setHours(23, 59, 59, 999)),
};

export const signupService = async (req: any, res: any) => {
  try {
    const { username, email, password } = req.body;

    console.log(username);

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const hash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hash,
      },
      select: { username: true },
    });

    const token = createJWT(user);

    try {
      await res.cookie("jwt", token, setCookieOptions);
    } catch (error) {
      console.error("Error setting Cookie:", error);
      res.status(500).send("Error setting Cookie");
    }

    res.status(200).json({ message: "Created successfully", token });
  } catch (error) {
    console.error("Error creating user: ", error);
    res.status(400).send("Error creating user");
  }
};

export const updateMPinService = async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const hash = await hashPassword(password);

    await prisma.user.update({
      data: {
        password: hash,
      },
      where: {
        username: username,
      },
    });

    return res.status(200).json({ message: "MPin updated successfully" });
  } catch (err) {
    console.error("Error updating MPin:", err);
    return res.status(500).json({ message: "Error updating MPin" });
  }
};

export const signinService = async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    console.log(username);

    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    console.log("User fetched:", user);

    if (!user) {
      return res.status(404).json({ message: "UserName not found" });
    }

    // Verify Password
    if (user.password === null) {
      return res.status(404).json({ message: "MPin not set" });
    }
    const passwordValid = await comparePasswords(password, user.password!);
    console.log(passwordValid);
    if (!passwordValid) {
      return res.status(404).json({ message: "Incorrect Password" });
    }

    const token = createJWT(user);

    try {
      await res.cookie("jwt", token, setCookieOptions);
    } catch (error) {
      console.error("Error setting Cookie:", error);
      res.status(500).send("Error setting Cookie");
    }

    return res.status(200).json({
      user: user.username,
      //role: user.Role,
      token: token,
    });
  } catch (err) {
    console.error("Error during sign in:", err);
    return res.status(500).json({ message: "Sign In Error" });
  }
};

export const signoutService = (req: any, res: any) => {
  try {
    res
      .clearCookie("jwt")
      .status(200)
      .json({ message: "Signout successfully" });
  } catch (error) {
    console.error("Error during signout:", error);
    return res.status(500).json({ message: "Sign out Error" });
  }
};

export const getUsers = async (req: any, res: any) => {
  try {
    console.log("Getting users");
    const searchuser = req.query.name;
    let users;
    if (!searchuser) {
      users = await prisma.user.findMany({
        select: { username: true },
      });
    } else {
      users = await prisma.user.findMany({
        where: {
          username: {
            contains: searchuser,
          },
        },
        select: { username: true },
      });
    }

    console.log(users);
    return res.status(200).json(users);
  } catch (err) {
    console.error("Error getting users:", err);
    return res.status(500).json({ message: "Error getting users" });
  }
};
