import prisma from "../lib/prisma.js";
import { serviceCreatePost, serviceDeletePost, serviceGetAllPosts, serviceGetPostById } from "../service/post.service.js";
import mapStatusHTTP from "../util/mapStatusHTTP.js";
import jwt from "jsonwebtoken";

export const getAllPosts = async (req, res) => {
    const query = req.query;
    try {
        const {status, data} = await serviceGetAllPosts(query);
        res.status(mapStatusHTTP(status)).json(data);
    } catch (error) {
        res.status(mapStatusHTTP("INTERNAL_SERVER_ERROR")).json({ message: "Error retrieving posts" });
    }
}

export const getPostById = async (req, res) => {
    const id = req.params.id;
    const token = req.cookies?.token;

    try {   
        const {status, data} = await serviceGetPostById(id, token);
        res.status(mapStatusHTTP(status)).json(data);
    }
    catch (error) {
        res.status(mapStatusHTTP("INTERNAL_SERVER_ERROR")).json({ message: "Error retrieving post" });
    }
}

export const createPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;
    try {
        const {status, data} = await serviceCreatePost(body,tokenUserId);
        console.log(data)
        
        res.status(mapStatusHTTP(status)).json(data);
    
    } catch (error) {
        res.status(mapStatusHTTP("INTERNAL_SERVER_ERROR")).json({ message: "Error creating post" });
    }
}

export const updatePost = async (req, res) => {}

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    
    try {
        const {status, data} = await serviceDeletePost(id, tokenUserId);
        console.log(data)
        console.log(status)
        res.status(mapStatusHTTP(status)).json(data.message);
    } catch (error) {
        res.status(500).json({ message: "Error deleting post" });
    }
}