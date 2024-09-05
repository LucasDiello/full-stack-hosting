import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import mapStatusHTTP from "../util/mapStatusHTTP.js";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import transporter from "../config/nodemailer.js";


export const resendEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(mapStatusHTTP("NOT_FOUND")).json({ message: 'Usuário não encontrado.' });
    }

    if (user.isVerified) {
      return res.status(mapStatusHTTP("NOT_FOUND")).json({ message: 'E-mail já verificado.' });
    }
    
    const newToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const userUpdated = await prisma.user.update({
      where: {
        email
      },
      data: {
        isVerified: false,
        verifiedToken: newToken
      }
    })
    console.log("userupdated", userUpdated)
    const verifyLink = `http://localhost:5173/verify-email?email=${email}&token=${newToken}`;
    
    transporter.sendMail({
      from: ' "Alugue@já -" <lucasoliveiradiello@gmail.com>',
      to: email,
      subject: "Verificação de ativação de conta",
      text: "Verifique seu e-mail!!",
      html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #9ac5c8;"> Verificação de e-mail </h1>
        <p style="font-size: 18px; line-height: 1.5;">Olá ${user.username}!!</p>
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
    res.status(mapStatusHTTP("SUCCESSFUL")).json({ message: 'E-mail de verificação reenviado com sucesso.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
}

export const verifyEmail = async (req,res) => {
  const { token } = req.query;
try {
  // Verifica o token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded)
  const { email } = decoded;

  console.log(email)
  // Busca o usuário correspondente
  const user = await prisma.user.findUnique({ where: { email } });
  console.log(user)
  if (!user) {
    return res.status(mapStatusHTTP("NOT_FOUND")).json({ message: 'Usuário não encontrado.' });
  }
  console.log(user.isVerified)
  if (user.isVerified) {
    console.log("n entrei")
    return res.status(mapStatusHTTP("NOT_FOUND")).json({ message: 'E-mail já verificado.' });
  }

  if (user.verifiedToken !== token) {
    return res.status(mapStatusHTTP("UNAUTHORIZED")).json({ message: 'Token inválido ou expirado.' });
  }

  // Atualiza o status de verificação
  const userUpdate = await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      verifiedToken: null,
    },
  });

  console.log(userUpdate)

  res.status(mapStatusHTTP("SUCCESSFUL")).json({ message: 'E-mail verificado com sucesso.' });
} catch (error) {
  console.error(error);
  if (error.name === 'TokenExpiredError') {
    return res.status(400).json({ message: 'Token inválido ou expirado.' });
  }
  res.status(500).json({ message: 'Erro no servidor.' });
}
}

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
      expiresIn: "1d",
    });
    if (existingUser) {
      return res
        .status(mapStatusHTTP("CONFLICT"))
        .json({ message: "Usuário já existe" });
    }
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        verifiedToken,
      },
    });

    const verifyLink = `http://localhost:5173/verify-email?email=${email}&token=${verifiedToken}`;

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
    res.status(mapStatusHTTP("CREATED")).json({ message: "Usuário criado!" });
  } catch (err) {
    console.log(err)
    res
      .status(mapStatusHTTP("INTERNAL_SERVER_ERROR"))
      .json({ message: "Falha ao criar usuário" });
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
        .json({ message : "Credenciais de Usuário inválidas." });
      }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res
        .status(mapStatusHTTP("UNAUTHORIZED"))
        .json({ message: "Credenciais de Senha inválidas." });
    }

    if (!user.isVerified) {
      return res
      .status(mapStatusHTTP("UNAUTHORIZED"))
      .json({ message: "Verifique seu e-mail para ativar sua conta." })
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
      .json({ message: "Falha ao relizar login!" });
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
        .json({ message: "Email não verificado!" });
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
      .json({ message: "Falha ao logar com usuário google!" });
  }
};

