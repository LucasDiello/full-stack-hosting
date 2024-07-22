import jwt from "jsonwebtoken";
import mapStatusHTTP from "../util/mapStatusHTTP.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(mapStatusHTTP("UNAUTHORIZED"))
      .json({ message: "NOT AUTHORIZED" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err)
      return res
        .status(mapStatusHTTP("FORBIDDEN"))
        .json({ message: "Invalid Token" });

        req.userId = payload.id;
        next();
  });

};
