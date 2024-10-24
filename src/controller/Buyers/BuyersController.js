const UserModel = require('../../model/user/UserModel')

exports.buyerList = async (req, res) => {
    try {

        let SearchValue = req.params.Keyword;

        let searchRegex = {"$regex": req.params.Keyword, "$options": 'i'}
        let SearchKeywords = {$or: [{fullName: searchRegex}, {address: searchRegex}, {profileStatus: searchRegex}, {email: searchRegex}, {mobile: searchRegex}]}

        let data;

        if(SearchValue !== 0){
            data = await UserModel.aggregate([
                {$match: SearchKeywords},
                {
                    $facet: {
                        Total: [{$count: 'Total'}],
                        Rows: [{$project: {_id: 1,email: 1,mobile: 1,fullName: 1,country: 1,userPhoto:1}}]
                    }
                }
            ])
        }else{
            data = await UserModel.aggregate([
                {
                    $facet: {
                        Total: [{$count: 'Total'}],
                        Rows: [{$project: {_id: 1,email: 1,mobile: 1,fullName: 1,country: 1,userPhoto:1}}]
                    }
                }
            ])
        }

        res.status(200).json({status: 'success', data: data})

    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}