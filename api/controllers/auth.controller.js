import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import mapStatusHTTP from "../util/mapStatusHTTP.js";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });

    const verifiedToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(existingUser)
    if (existingUser) {
      return res
        .status(mapStatusHTTP("CONFLICT"))
        .json({ message: "User already exists" });
    }
    console.log(verifiedToken)
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        verifiedToken,
      },
    });
    console.log(user)
    const verifyLink = `http://localhost:5173/verify-email?token=${verifiedToken}`;
      transporter.sendMail({
        from: ' "Alugue@já -" <lucasoliveiradiello@gmail.com>',
        to: email,
        subject: "Verificação de ativação de conta",
        text: "Verifique seu e-mail!!",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #9ac5c8;"> Verificação de e-mail </h1>
          <p style="font-size: 18px; line-height: 1.5;">Olá ${username}!!</p>
          <p style="font-size: 14px; line-height: 1.5;">
          Obrigado por se registrar em nosso site.
          Somos uma plataforma de anuncios e vendas de imóveis, onde você pode anunciar e vender seus imóveis de forma rápida e segura.
          Estamos muito felizes em tê-lo conosco!
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            Clique no link abaixo para verificar seu e-mail e ativar sua conta:
          </p>
          <div style="margin: 20px 0;">
            <a href="${verifyLink}" style="
              background-color: #9ac5c8;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-size: 18px;
            ">
              Verificar e-mail
            </a>
          </div>
          <p style="font-size: 14px; color: #777;">Se você não solicitou esta verificação, por favor, ignore este e-mail.</p>
        </div>
        `,
      }).then((info) => {
        console.log("Message sent: %s", info);
      } ).catch((err) => {
        console.log(err)
      }
      )
    res.status(mapStatusHTTP("CREATED")).json({ message: "User created" });
  } catch (err) {
    console.log(err)
    res
      .status(mapStatusHTTP("INTERNAL_SERVER_ERROR"))
      .json({ message: "Failed to create user" });
  }
};

export const login = async (req, res) => {
  const { username, password, useCookies } = req.body;
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


    if(useCookies) {
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
        sameSite: "none", // Necessário se estiver usando cookies com domínio diferente
        secure: true, // Necessário se estiver usando HTTPS
      })
    }

      return res
        .status(mapStatusHTTP("SUCCESSFUL"))
        .json(
          { ...dataUser, token }
        );
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
  const { idToken, useCookies } = req.body;
  try {
    const decoded = jwtDecode(idToken);
    const { email, email_verified, name, picture } = decoded;

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

    if(useCookies) {
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
        sameSite: "none", // Necessário se estiver usando cookies com domínio diferente
        secure: true, // Necessário se estiver usando HTTPS
      })
    }

    return res
      .status(mapStatusHTTP("SUCCESSFUL"))
      .json(
        { ...dataUser, token }
      );
  } catch (err) {
    res
      .status(mapStatusHTTP("INTERNAL_SERVER_ERROR"))
      .json({ message: "Failed to login with google" });
  }
};
