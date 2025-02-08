import "dotenv/config";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User {
  username: string;
}

export const comparePasswords = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 5);
};

export const createJWT = (person: User) => {
  // Calculate the expiration time to the end of the current day
  const now = new Date();
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );
  const expiresIn = Math.floor((endOfDay.getTime() - now.getTime()) / 1000);

  let id: string;
  let role: string;

  if ("username" in person) {
    id = person.username;
    role = "kitchen";
  } else {
    throw new Error("Invalid person object");
  }

  const token = jwt.sign({ id, role }, process.env.JWT_SECRET_KEY!, {
    expiresIn,
  });
  return token;
};

export const verifyJWT = (token: string) => {
  try {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT key is not defined");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return payload;
  } catch (error) {
    throw new Error("Error in verifying JWT");
  }
};

export const verifyTokenService = async (req: any, res: any) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log("No token provided");
    return res.status(400).json({ error: "No token provided" });
  }

  try {
    const decodedtoken = await verifyJWT(token);
    if (decodedtoken) {
      res.status(200).json({ decoded: decodedtoken });
    }
  } catch (err) {
    res.status(500).json({ "Error while verifying token ": err });
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
