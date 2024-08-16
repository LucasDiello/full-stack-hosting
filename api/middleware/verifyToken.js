import mapStatusHTTP from "../util/mapStatusHTTP.js";
import { jwtDecode } from "jwt-decode";


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies.token;

  const token = authHeader ? authHeader.split(' ')[1] : cookieToken;

  if (!token) {
    return res
      .status(mapStatusHTTP("UNAUTHORIZED"))
      .json({ message: "NOT AUTHORIZED" });
  }

  const { id } = jwtDecode(token);
  req.userId = id;
  next();
};
