import express from "express";
import replyController from "../controllers/carRepliesController.js";

const replyRouter = express.Router();

replyRouter.post("/", replyController.createReply);
replyRouter.get("/", replyController.getAllRepliesForReview);
replyRouter.get("/:id", replyController.getReply);
replyRouter.put("/:id", replyController.updateReply);
replyRouter.delete("/:id", replyController.deleteReply);

export default replyRouter;
