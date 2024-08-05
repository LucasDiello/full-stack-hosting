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
                orderBy: {
                    createdAt: 'asc'
                },
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
    if (tokenUserId === receiverId) 
        return {
            status: "UNAUTHORIZED",
            data: `Este imóvel é seu.`
    }

    const chatExists = await prisma.chat.findFirst({
        where: {
            userIDs: {
                hasEvery: [tokenUserId, receiverId]
            }
        }
    });


    if (chatExists) 
        return {
            status: "SUCCESSFUL",
            data: `Chat já adicionado.`
    }
    

    const newChat = await prisma.chat.create({
        data: {
            userIDs: [tokenUserId, receiverId]
        }
    });

    const addChatInUser = await prisma.user.update({
        where: {
            id: tokenUserId
        },
        data: {
            chatIds: {
                push: newChat.id
            }
        }
    });

    return {
        status: "SUCCESSFUL",
        data: `Chat adicionado!!`
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
                push: [tokenUserId]
            }
        }
    });

    return {
        status: "SUCCESSFUL",
        data: chat
    }
};

