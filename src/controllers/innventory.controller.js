const {SuccessResponse} = require('../cores/success.response')
const InnventoryService = require("../services/inventory.service");

class InnventoryController {

    addStockToInnventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new cart addStockToInnventory',
            metadata: await InnventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}

module.exports = new InnventoryController()
