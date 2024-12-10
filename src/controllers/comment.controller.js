const CommentService = require('../services/comment.service');
const {CREATED, SuccessResponse} = require("../cores/success.response");

class CommentController {

    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add comment success',
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add comment success',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res)
    }

    deleteComments = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete comment success',
            metadata: await CommentService.deleteComments(req.query)
        }).send(res)
    }
}

module.exports = new CommentController()
