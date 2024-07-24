import { serviceGetAllChats } from "../service/chat.service.js";
import mapStatusHTTP from "../util/mapStatusHTTP.js";


export const getAllChats = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const {status, data} = await serviceGetAllChats(tokenUserId);
        res.status(mapStatusHTTP(status)).json(data);
    }catch (error) {
        res.status(mapStatusHTTP("INTERNAL_SERVER_ERROR")).json({message : "Error retrieving chats"});
    }
};

export const getChatById = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        const {status, data} = await serviceGetChatById(id, tokenUserId);
        res.status(mapStatusHTTP(status)).json(data);
    }
    catch (error) {
        res.status(mapStatusHTTP("INTERNAL_SERVER_ERROR")).json({message : "Error retrieving chat"});
    }
};

export const createChat = async (req, res) => {};

export const readChat = async (req, res) => {};