import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const serviceGetAllPosts = async (query) => {
  const { city, type, property, bedroom, minPrice, maxPrice } = query;
  const posts = await prisma.post.findMany({
    where: {
      city: city || undefined,
      type: type || undefined,
      property: property || undefined,
      bedroom: parseInt(bedroom) || undefined,
      price: {
        gte: parseInt(minPrice) || undefined,
        lte: parseInt(maxPrice) || undefined,
      },
    },
  });
  return {
    status: "SUCCESSFUL",
    data: posts,
  };
};

export const serviceGetPostById = async (id, token) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      postDetail: true,
      user: {
        select: {
          username: true,
          avatar: true ,
        },
      },
    },
  });
  if (!post) {
    return {
      status: "NOT_FOUND",
      data: {
        message: "Post not found",
      },
    };
  }

  if (token) {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          postId: id,
          userId: payload.id,
        },
      },
    });
    return {
      status: "SUCCESSFUL",
      data: {
        ...post,
        isSaved: !!savedPost,
      },
    };
  }

  return {
    status: "SUCCESSFUL",
    data: {
      ...post,
      isSaved: false,
    },
  };
};

export const serviceCreatePost = async (body, tokenUserId) => {
  const newPost = await prisma.post.create({
    data: {
      ...body.postData,
      userId: tokenUserId,
      postDetail: {
        create: body.postDetail,
      },
    },
  });
  return {
    status: "SUCCESSFUL",
    data: newPost,
  };
};

export const serviceUpdatePost = async (id, inputs) => {};

export const serviceDeletePost = async (id, tokenUserId) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (post.userId !== tokenUserId) {
    return {
      status: "FORBIDDEN",
      data: {
        message: "You are not authorized to delete this post",
      },
    };
  }

  const postDetail = await prisma.postDetail.findUnique({
    where: { postId: id },
  });
  console.log(postDetail);

  if (postDetail) {
    await prisma.postDetail.delete({
      where: { postId: id },
    });
  }

  await prisma.post.delete({
    where: { id },
  });

  return {
    status: "SUCCESSFUL",
    data: {
      message: "Post deleted successfully",
    },
  };
};
