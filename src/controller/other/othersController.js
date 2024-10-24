const ColorModel = require('../../model/other/ColorModel')
exports.createColor = async (req, res) => {
    try {
        let PostBody = req.body;
        let create = await ColorModel.create(PostBody)
        res.status(200).json({status: 'success', data: create})
    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}