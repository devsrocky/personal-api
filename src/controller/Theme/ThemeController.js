const mongoose = require('mongoose')
const DataModel = require('../../model/hero/HeroModel')
const UserModel = require('../../model/user/UserModel')
const NicheModel = require('../../model/niches/NicheModel')
const PortfolioModel = require('../../model/portfolio/PortfolioModel')
const OrderModel = require('../../model/order/OrderModel')
const RowWordModel = require('../../model/rowWork/RowWordModel')

const updateAdministratorService = require('../../service/common/updateAdministratorService')
const CommonListByNichService = require('../../service/common/CommonListByNichService')
const CommonListJoinService = require('../../service/common/CommonListJoinService')
const CommonListService = require('../../service/common/CommonListService')
const CheckAssociation = require('../../service/common/CheckAssociation')
const CommonCreateByAdminService = require('../../service/common/CommonCreateByAdminService')
const CommonDeleteByAdminService = require('../../service/common/CommonDeleteByAdminService')


// ---- Hero Content ----
exports.CreateHeroContent =  async (req, res) => {
    let data = await CommonCreateByAdminService(req, DataModel, UserModel)
    res.status(200).json(data)
}

exports.updateHeroContent = async (req, res) => {
    let data = await updateAdministratorService(req, DataModel, UserModel)
    res.status(200).json(data)
}

exports.listHeroContent = async (req, res) => {

    let searchRegex = {"$regex": req.params.keyword, "$options": "i"}
    let SearchKeywords = {$or: [{Name: searchRegex}]}
    let data = await CommonListService(req, DataModel, SearchKeywords)
    res.status(200).json(data)

}

exports.HeroContentDetails = async (req, res) => {
    try {
        let id = req.params.id
        let data = await DataModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(id)}}
        ])
        res.status(200).json({status: 'success', data: data})
    } catch (err) {
        res.status(200).json({status: 'failed', data: err.toString()})
    }
}

exports.deleteHeroContent = async (req, res) => {
    let data = await CommonDeleteByAdminService(req, DataModel, UserModel)
    res.status(200).json(data)
}



// ---- Niches ----
exports.CreateNiche = async (req, res) => {
    let data = await CommonCreateByAdminService(req, NicheModel, UserModel)
    res.status(200).json(data)
}

exports.updateNiche = async (req, res) => {
    let data = await updateAdministratorService(req, NicheModel, UserModel)
    res.status(200).json(data)
}
exports.listNiches = async (req, res) => {

    let searchRegex = {"$regex": req.params.keyword, "$options": "i"}
    let SearchKeywords = {$or: [{Name: searchRegex}]}

    let data = await CommonListService(req, NicheModel, SearchKeywords)
    res.status(200).json(data)

}

exports.deleteNich = async (req, res) => {

    try {
        
    let DeleteId = req.params.DeleteId;
    let ObjectId = mongoose.Types.ObjectId;
    let UserDetails = JSON.parse(req.headers['UserDetails'])

    let IsAssociateOrder = await CheckAssociation({RowWorkId: new ObjectId(DeleteId)}, OrderModel)
    let IsAssociateRowWork = await CheckAssociation({NicheId: new ObjectId(DeleteId)}, RowWordModel)

    let user = await UserModel.aggregate([
        {$match: {email: UserDetails['UserEmail']}},
        {$project: {_id: 0, userRole:1}}
    ])

    if(user[0]['userRole'] === 'administrator'){
        if(IsAssociateOrder){
            res.status(200).json({status: 'associated', data:'The nich is associated with order'})
        }else if(IsAssociateRowWork){
            res.status(200).json({status: 'associated', data:'The nich is associated with RowWork'})
        }else{
            let data = await NicheModel.deleteOne(new ObjectId(DeleteId))
            res.status(200).json({status: 'success', message:'The nich has been deleted', data: data})
        }
    }else{
        res.status(200).json({status: 'failed', message: 'You are not eligible'})
    }

    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}

exports.NicheDetails = async (req, res) => {
    try {
        let id = req.params.id
        let data = await NicheModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(id)}}
        ])
        res.status(200).json({status: 'success', data: data})
    } catch (err) {
        res.status(200).json({status: 'failed', data: err.toString()})
    }
}

// ---- Portfolios ----
exports.CreatePortfolio = async (req, res) => {
    let data = await CommonCreateByAdminService(req, PortfolioModel, UserModel)
    res.status(200).json(data)
}

exports.updatePortfolio = async (req, res) => {
    let data = await updateAdministratorService(req, PortfolioModel, UserModel)
    res.status(200).json(data)
}

exports.listPortfolio = async (req, res) => {

    let searchRegex = {"$regex": req.params.keyword, "$options": "i"}
    let SearchKeywords = {$or: [{ProjectName: searchRegex}, {'Niche.Name': searchRegex}]}
    let JoinStage = {$lookup: {from: 'niches', localField: 'NicheId', foreignField: '_id', as: 'Niche'}}

    let data = await CommonListJoinService(req, PortfolioModel, SearchKeywords, JoinStage)
    res.status(200).json(data)

}

exports.listByNiche =async (req, res) => {
    let data = await CommonListByNichService(req, PortfolioModel)
    res.status(200).json({data})
}

exports.deletePortfolio = async (req, res) => {
    let data = await CommonDeleteByAdminService(req, PortfolioModel, UserModel)
    res.status(200).json(data)
}

exports.PortfolioDetails = async (req, res) => {
    try {
        let id = req.params.id
        let data = await PortfolioModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(id)}},
            {$lookup: {from: 'niches', localField: 'NicheId', foreignField: '_id', as: 'Niche'}},
            {$unwind: "$Niche"},{
                $project: {_id: 1, ProjectName: 1, Description: 1, Template: 1, 'Niche._id': 1, 'Niche.Name': 1} 
            }
        ])
        res.status(200).json({status: 'success', data: data})
    } catch (err) {
        res.status(200).json({status: 'failed', data: err.toString()})
    }
}
