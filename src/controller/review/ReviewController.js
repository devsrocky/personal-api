const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;
const ReviewModel = require("../../model/reviews/ReviewModel")
const UserModel = require("../../model/user/UserModel")
const CommonListJoinProjectionService = require("../../service/common/CommonListJoinProjectionService")
const CommonUpdateService = require("../../service/common/CommonUpdateService")
const ReviewService = require("../../service/review/ReviewService");
const CommonDeleteByAdminService = require("../../service/common/CommonDeleteByAdminService");
const CommonListJoin3ProjectionService = require("../../service/common/CommonListJoin3PorjectionService");
const CommonListByNichService = require("../../service/common/CommonListByNichService");

exports.CreateReview = async (req, res) => {
    let data = await ReviewService(req, ReviewModel)
    res.status(200).json(data)
}

exports.updateReview = async (req, res) => {
    let data = await CommonUpdateService(req, ReviewModel, UserModel)
    res.status(200).json(data)
}

exports.listOfReview = async (req, res) => {
    try{


        let SearchRegex = {"$regex": req.params.keyword, "$options": "i"}
        let SearchKeywords = {$or: [{StarCommunicate: SearchRegex}, {StarRecomend: SearchRegex}, {StarService: SearchRegex}, {'User.country': SearchRegex}, {'Order.OrderNumber': SearchRegex}, {'Nich.Name': SearchRegex}]}

        let JoinStage1 = {$lookup: {from: 'users', localField: 'UserId', foreignField: '_id', as: 'User'}}
        let JoinStage2 = {$lookup: {from: 'orders', localField: 'OrderId', foreignField: '_id', as: 'Order'}}
        let JoinStage3 = {$lookup: {from: 'niches', localField: 'NicheId', foreignField: '_id', as: 'Nich'}}

        let Project = {$project: {_id: 1, StarCommunicate: 1, StarRecomend: 1, StarService: 1,createdDate: 1, ReviewDescription: 1, 'User.fullName': 1, 'User.country': 1, 'User.userPhoto': 1, 'Order._id': 1, 'Order.OrderNumber': 1, 'Order.createdDate': 1, 'Nich._id': 1, 'Nich._id': 1, 'Nich.Name': 1, 'Nich.createdDate': 1}}

        let data = await CommonListJoin3ProjectionService(req, SearchKeywords, ReviewModel, JoinStage1, JoinStage2, JoinStage3, Project)
        res.status(200).json(data)
        
    }catch(err){
        res.status(200).json({status: 'failed', data: err.toString()})
    }
}

exports.reviewListByNich = async (req, res) => {
    try{
        let tablink = new ObjectId(req.params.tablink);
        let Project = {$project: {_id: 1, StarCommunicate: 1, StarRecomend: 1, StarService: 1,createdDate: 1, ReviewDescription: 1, 'User.fullName': 1, 'User.country': 1, 'User.userPhoto': 1, 'Order._id': 1, 'Order.OrderNumber': 1, 'Order.createdDate': 1, 'Nich._id': 1, 'Nich._id': 1, 'Nich.Name': 1, 'Nich.createdDate': 1}}

        let data = await ReviewModel.aggregate([
            {
                $facet: {
                    Total: [{$count: 'Total'}],
                    Rows: [
                        {$match: {NicheId: tablink}},
                        {$lookup: {from: 'users', localField: 'UserId', foreignField: '_id', as: 'User'}},
                        {$lookup: {from: 'orders', localField: 'OrderId', foreignField: '_id', as: 'Order'}},
                        {$lookup: {from: 'niches', localField: 'NicheId', foreignField: '_id', as: 'Nich'}},
                        Project
                    ]
                }
            }
        ])
        res.status(200).json({status: 'success', data: data})
    }catch(err){
        res.status(200).json({status: 'failed', data: err.toString()})
    }

}

exports.DeleteReview = async (req, res) => {
    let data = await CommonDeleteByAdminService(req, ReviewModel, UserModel)
    res.status(200).json(data)
}

exports.reviewDetailsById = async (req, res) => {
    try {
        let ReviewId = req.params.ReviewId;
        let data = await ReviewModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(ReviewId)}},
            {$lookup: {from: 'users', localField: 'UserId', foreignField: '_id', as: 'user'}},
            {$unwind: '$user'},
            {$lookup: {from: 'orders', localField: 'OrderId', foreignField: '_id', as: 'order'}},
            {$unwind: '$order'},
            {$lookup: {from: 'niches', localField: 'NicheId', foreignField: '_id', as: 'niche'}},
            {$unwind: '$niche'},
            {$project: {
                _id: 1, StarCommunicate: 1, StarRecomend: 1, StarService: 1, ReviewDescription: 1, 'user._id': 1, 'user.fullName': 1, 'order._id': 1, 'order.OrderTitle': 1, 'niche._id': 1, 'niche.Name':1}}
        ])
        res.status(200).json({status: 'success', data: data})
    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}
