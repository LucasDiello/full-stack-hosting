import prisma from "../lib/prisma.js";
import { serviceDeleteUser, serviceGetAllUsers, serviceGetUserById, serviceUpdateUser } from "../service/user.service.js";
import mapStatusHTTP from "../util/mapStatusHTTP.js";

export const getAllUsers = async (req, res) => {
    try {
        const {status, data} = await serviceGetAllUsers();
        res.status(mapStatusHTTP(status)).json(data);
    }
    catch (error) {
        res.status(mapStatusHTTP("INTERNAL_SERVER_ERROR")).json({message : "Error retrieving users"});
    }
};
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const {status, data} = await serviceGetUserById(id);
        res.status(mapStatusHTTP(status)).json(data);
    } catch (error) {
        res.status(mapStatusHTTP("INTERNAL_SERVER_ERROR")).json({message : "Error find user"});
    }
};
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const tokenUserId = req.userId;
        const { password, avatar, ...inputs } = req.body;
        console.log(tokenUserId);
        if (id !== tokenUserId ) {
          return res.status(mapStatusHTTP("FORBIDDEN")).json({ message: "Not Authorized!"  });
        }

        const {status, data} = await serviceUpdateUser(id, inputs, password, avatar);

        res.status(mapStatusHTTP(status)).json(data);
    } catch (error) {
        res.status(mapStatusHTTP("INTERNAL_SERVER_ERROR")).json({message : "Error updating user"});
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const tokenUserId = req.userId;
        if (id !== tokenUserId ) {
          return res.status(mapStatusHTTP("FORBIDDEN")).json({ message: "Not Authorized!"  });
        }
        const {status, data : { message }} = await serviceDeleteUser(id);
        res.status(mapStatusHTTP(status)).json({message});
    } catch (error) {
        res.status(mapStatusHTTP("INTERNAL_SERVER_ERROR")).json({message : "Error deleting user"});
    }
};