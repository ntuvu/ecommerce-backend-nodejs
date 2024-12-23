const {
    pushNotiToSystem,
    listNotiByUser
} = require('../services/notification.service');
const {CREATED, SuccessResponse} = require("../cores/success.response");

class NotificationController {

    pushNotiToSystem = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create noti success',
            metadata: await pushNotiToSystem(req.body)
        }).send(res)
    }

    listNotiByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add comment success',
            metadata: await listNotiByUser(req.query)
        }).send(res)
    }
}

module.exports = new NotificationController()
