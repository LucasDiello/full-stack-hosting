import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import mapStatusHTTP from "../util/mapStatusHTTP.js";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import transporter from "../config/nodemailer.js";


const generateToken = (payload, expiresIn = "1m") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn } );
};

const sendEmail = async (email, html) => {
  console.log(email)
 return transporter.sendMail({
    from: ' "Alugue@já -" <lucasoliveiradiello@gmail.com>',
    to: email,
    subject: "Ativação de conta",
    text: "Verifique seu e-mail!!",
    html,
  }).then((info) => {
    console.log("Message sent: %s", info);
  } ).catch((err) => {
    console.log(err)
  }
  )
};

const generateVerificationEmailHTML = (username, verifyLink) => {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; color: #333; background-color: #f8f8f8; padding: 3rem;">
      <tr style="heigth:700px">
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: white; border-radius: 5px;">
            <tr>
              <td align="center" style="border:1px solid #f8f8f8">
                <img width="150" height="150" src="https://img.freepik.com/vetores-premium/design-de-logotipo-com-iniciais-lh-modelo-de-logotipo-com-letra-inicial-luxo-criativo_773552-212.jpg" alt="Logo"/>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 1rem; padding-top:2rem">
                <p style="font-size: 18px; margin: 0;">Olá ${username}!</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 1rem;">
                <h1 style="margin: 0;">Confirmação de e-mail</h1>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 1rem;">
                <p style="font-size: 12px; margin: 0;">
                  Clique no link abaixo para Confirmar seu e-mail e ativar sua conta:
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top: 3rem;">
                <a href="${verifyLink}" style="
            appearance: none;
            background-color: #FAFBFC;
            border: 1px solid rgba(27, 31, 35, 0.15);
            border-radius: 6px;
            box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;
            box-sizing: border-box;
            color: #24292E;
            cursor: pointer;
            display: inline-block;
            font-family: -apple-system, system-ui, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            list-style: none;
            padding: 6px 25px;
            position: relative;
            transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            vertical-align: middle;
            white-space: nowrap;
            word-wrap: break-word;
            text-decoration:none;
        "
        onmouseover="
            this.style.backgroundColor = '#F3F4F6';
            this.style.transitionDuration = '0.1s';
        "
        onmouseout="
            this.style.backgroundColor = '#FAFBFC';
            this.style.transitionDuration = '0.2s';
        "
        onmousedown="
            this.style.backgroundColor = '#EDEFF2';
            this.style.boxShadow = 'rgba(225, 228, 232, 0.2) 0 1px 0 inset';
            this.style.transition = 'none';
        "
        onmouseup="
            this.style.backgroundColor = '#F3F4F6';
            this.style.boxShadow = 'rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset';
            this.style.transition = '0.2s cubic-bezier(0.3, 0, 0.5, 1)';
        "
        onfocus="
            this.style.outline = '1px transparent';
        "
        onblur="
            this.style.outline = 'none';
        ">
                  Confirmar e-mail
                </a>
              </td>
            </tr>
            <tr >
              <td align="center" style="padding-bottom: 1rem; padding-top:125px">
                <p style="font-size: 12px; margin: 0; margin-bottom:15px">
                  Obrigado por se registrar em nosso site. Somos uma plataforma de anúncios e vendas de imóveis, onde você pode anunciar e vender seus imóveis de forma rápida e segura.
                  Estamos muito felizes em tê-lo conosco!
                </p>
                <p style="font-size: 10px; color: #777; margin: 0;">
                  Se você não solicitou esta confirmação, por favor, ignore este e-mail.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};


export const verifyEmail = async (req,res) => {
  const { token } = req.query;
try {
  // Verifica o token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { email } = decoded;
  
  if (!email) {
    console.log("n entrei")
  }
  // Busca o usuário correspondente
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(mapStatusHTTP("NOT_FOUND")).json({ message: 'Usuário não encontrado.' });
  }

  if (user.isVerified) {
    return res.status(mapStatusHTTP("NOT_FOUND")).json({ message: 'E-mail já verificado.' });
  }

  if (user.verifiedToken !== token) {
    return res.status(mapStatusHTTP("UNAUTHORIZED")).json({ message: 'Verificação inválida ou expirada.' });
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
    return res.status(400).json({ message: 'Verificação inválida ou expirada.' });
  }
  res.status(500).json({ message: 'Erro no servidor.' });
}
}

export const resendEmail = async (req, res) => {
  const { email, username } = req.query;
  try {
    const user = await prisma.user.findFirst({ where: {
      OR: [
        {
          username,
        },
        {
          email,
        },
      ],
      
    } });
    console.log(user)
    if (!user) {
      return res.status(mapStatusHTTP("NOT_FOUND")).json({ message: 'Usuário não encontrado.' });
    }

    if (user.isVerified) {
      return res.status(mapStatusHTTP("NOT_FOUND")).json({ message: 'E-mail já verificado.' });
    }
    const newToken = generateToken({ email : user.email });

    const userUpdated = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        isVerified: false,
        verifiedToken: newToken 
      }
    })

    const verifyLink = `http://localhost:5173/verify-email?email=${user.email}&token=${newToken}`;
    const htmlContent = generateVerificationEmailHTML(user.username, verifyLink);

    await sendEmail(user.email, htmlContent);

    res.status(mapStatusHTTP("SUCCESSFUL")).json({ message: 'E-mail de verificação reenviado com sucesso.' });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Verificação inválida ou expirada.' });
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

    const verifiedToken = generateToken({ email });
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
    const htmlContent = generateVerificationEmailHTML(username, verifyLink);

      await sendEmail(user.email, htmlContent);
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

