import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import mapStatusHTTP from "../util/mapStatusHTTP.js";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

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

    res.status(mapStatusHTTP("CREATED")).json({ message: "User created" });
  } catch (err) {
    res
      .status(mapStatusHTTP("INTERNAL_SERVER_ERROR"))
      .json({ message: "Failed to create user" });
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

    const { password: userPassword, ...dataUser } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(mapStatusHTTP("SUCCESSFUL"))
      .json(dataUser);
  } catch (err) {
    res
      .status(mapStatusHTTP("INTERNAL_SERVER_ERROR"))
      .json({ message: "Failed to login" });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(mapStatusHTTP("SUCCESSFUL"))
    .json({ message: "Logout Successful" });
};

export const googleLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const decoded = jwtDecode(idToken);
    const { email, email_verified, name, picture } = decoded;
    console.log(decoded);
    console.log(email);
    if (!email_verified) {
      return res
        .status(mapStatusHTTP("UNAUTHORIZED"))
        .json({ message: "Email not verified" });
      }

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          username: name,
          password: idToken,
          avatar: picture,
        },
      });
    }

    const age = 100 * 60 * 60 * 24 * 7;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: age,
    });

    const { password: userPassword, ...dataUser } = user; // remove password from user data

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      }) 
      .status(mapStatusHTTP("SUCCESSFUL"))
      .json({
        ...dataUser,
        avatar: picture,
      });
  } catch (err) {
    res
      .status(mapStatusHTTP("INTERNAL_SERVER_ERROR"))
      .json({ message: "Failed to login with google" });
  }
};
