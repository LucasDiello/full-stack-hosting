import prisma from "../lib/prisma.js";


export const serviceGetAllChats = async (tokenUserId) => {
    const chats = await prisma.chat.findMany({
        where: {
            userIDs: {
                hasSome: [tokenUserId]
            }
        }
    })

    for (let chat of chats) {
    const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

    const receiver = await prisma.user.findUnique({
        where: {
            id: receiverId
        },
        select: {
            id: true,
            username: true,
            avatar: true
        }
    })
    chat.receiver = receiver;
    }
    
    return {
        status: "SUCCESSFUL",
        data: chats
    }
};

export const serviceGetChatById = async (id,tokenUserId) => {
    const chat = await prisma.chat.findUnique({
        where: {
            id: id,
            userIDs: {
                hasSome: [tokenUserId]
            }
        },
        include: {
            messages: {
                include: {
                   orderBy: {
                    createdAt: "asc"
                   }
                }
            }
        }
    });

    await prisma.chat.update({
        where: {
            id
        },
        data: {
            seenBy: {
                push: tokenUserId
            }
        }
    })

    return {
        status: "SUCCESSFUL",
        data: chat
    }
};

export const serviceCreateChat = async (tokenUserId, receiverId) => {
    const newChat = await prisma.chat.create({
        data: {
            userIDs: [tokenUserId, receiverId]
        }
    });

    return {
        status: "SUCCESSFUL",
        data: newChat
    }
};

export const serviceReadChat = async (id, tokenUserId) => {
    const  chat = await prisma.chat.findUnique({
        where: {
            id,
            userIDs: {
                hasSome: [tokenUserId]
            }
        },
        data: {
            seenBy: {
                set: [tokenUserId]
            }
        }
    });

    return {
        status: "SUCCESSFUL",
        data: chat
    }
};

