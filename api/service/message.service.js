import prisma from "../lib/prisma.js";


export const serviceCreateMessage = async (tokenUserId, chatId, text) => {
    const chat = await prisma.chat.findUnique({
        where: {
          id: chatId,
          userIDs: {
            hasSome: [tokenUserId],
          },
        },
      });
  
      if (!chat) return res.status(404).json({ message: "Chat not found!" });

      const message = await prisma.message.create({
        data: {
          text,
          chatId,
          userId: tokenUserId,
        },
      });

      await prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
            seenBy: [tokenUserId],
            lastMessage:text
        },
      });

        return {
            status: "SUCCESSFUL",
            data: message,
        };
}