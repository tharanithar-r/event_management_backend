import { verifyJWT } from "../services/auth/helper";

export const protect = async (req: any, res: any, next: any) => {
  try {
    const token: string = req.cookies.jwt;
    if (!token) {
      return res.status(400).json("No token provided");
    }
    const payload = verifyJWT(token);
    if (payload) {
      req.user = payload;
      next();
    }
  } catch (error: any) {
    res.status(401).json(error.message);
  }
};
