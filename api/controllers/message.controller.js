import { serviceCreateMessage } from "../service/message.service.js";
import mapStatusHTTP from "../util/mapStatusHTTP.js";


export const createMessage = async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const text = req.body.text;
    
    try {
        const {status, data} = await serviceCreateMessage(tokenUserId, chatId, text);
        res.status(mapStatusHTTP(status)).json(data);
    } catch (error) {
        res.status(mapStatusHTTP("INTERNAL_SERVER_ERROR")).json({ message: "Error creating message" });
    }
};