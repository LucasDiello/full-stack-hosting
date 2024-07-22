import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const serviceGetAllUsers = async () => {
    const users = await prisma.user.findMany();
    return {
        status: "SUCCESSFUL",
        data: users
    }
    };

export const serviceGetUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    return {
        status: "SUCCESSFUL",
        data: user
    }
}

export const serviceUpdateUser = async (userId, inputs, password, avatar) => {
    let updatedPassword = null;
    console.log(userId);
    console.log(password, avatar, inputs);
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }
  
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });
  
    return {
      status: "SUCCESSFUL",
      data: updatedUser,
    };
  };

export const serviceDeleteUser = async (userId) => {
    await prisma.user.delete({
        where: {
            id: userId
        }
    });
    return {
        status: "SUCCESSFUL",   
        data: {message:"User deleted"}
    }
}