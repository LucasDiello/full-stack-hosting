import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import mapStatusHTTP from "../util/mapStatusHTTP.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(mapStatusHTTP("CREATED")).json(user);
  } catch (err) {
    res
      .status(mapStatusHTTP("INTERNAL_SERVER_ERROR"))
      .json({ message: "Unable to create user" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res
        .status(mapStatusHTTP("UNAUTHORIZED"))
        .json({ message: "Invalid credentials User" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res
        .status(mapStatusHTTP("UNAUTHORIZED"))
        .json({ message: "Invalid credentials Password" });
    }
    // Generate cookie token and send it to the client
    // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
    const age = 100 * 60 * 60 * 24 * 7;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: age,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(mapStatusHTTP("SUCCESSFUL"))
      .json({ message: "Login Successful" });
  } catch (err) {
    res
      .status(mapStatusHTTP("INTERNAL_SERVER_ERROR"))
      .json({ message: "Unable to login" });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(mapStatusHTTP("SUCCESSFUL"))
    .json({ message: "Logout Successful" });
};
