const  mongoose= require('mongoose');
const DataModel = require('../../model/statistics/visitorCounterModel')
exports.SiteVisitor = async (req, res) => {
    try{

        let countMap = req.params.map;
        const ModelId = `6715ca9606653d8e0fee40e8`

        let counter = await DataModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(ModelId)}}
        ])

        if(countMap !== 'x'){

            const data = await DataModel.updateOne({_id: new mongoose.Types.ObjectId(ModelId)}, {UniqueVisitor: Number(counter[0]['UniqueVisitor']) + 1, PageView: Number(counter[0]['PageView']) + 1})
            res.status(200).json({status: 'success', data: data})
        }else{
            const data = await DataModel.updateOne({_id: new mongoose.Types.ObjectId(ModelId)}, {PageView: Number(counter[0]['PageView']) + 1})
            res.status(200).json({status: 'success', data: data})
        }


        // res.json(Number(counter[0]['UniqueVisitor']))
    }catch(err){
        res.status(200).json({status: 'failed', data: err.toString()})
    }
}

exports.SiteVisitorCountList = async (req, res) => {
    try {
        let data = await DataModel.aggregate([
            {$project: {
                _id: 0,
                UniqueVisitor:1,
                PageView:1
            }}
        ])
        res.status(200).json({status: 'success', data: data})

    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}