const mongoose = require('mongoose')
const multer  = require('multer')

const DataModel = require('../../model/user/UserModel')
const OTPModel = require('../../model/otp/OTPModel')
const userUpdateService = require('../../service/user/UpdateUser')
const userRegistrationService = require('../../service/user/userRegistrationService')
const userOTPVerificationService = require('../../service/user/userOTPVerificationService')
const userLoginService = require('../../service/user/userLoginService')
const CommonEmailVerifyService = require('../../service/common/CommonEmailVerifyService')
const CommonDetailsService = require('../../service/common/CommonDetailsService')
const CommonListService = require('../../service/common/CommonListService')
const { json } = require('body-parser')
const UserOTPVerification = require('../../service/user/UserOTPVerification')





exports.userRegistration = async (req, res) => {
    let data = await userRegistrationService(req, DataModel)
    res.status(200).json(data)
}

exports.userEmailVerification =  async (req, res) => {
    let data = await CommonEmailVerifyService(req, DataModel, OTPModel)
    res.status(200).json(data)
}

exports.userProfileVerification = async (req, res) => {
    let data = await userOTPVerificationService(req, DataModel, OTPModel)
    let UserEmail = req.params.email;
    if(data === true){
        await OTPModel.deleteOne({UserEmail: UserEmail, OTPStatus: 'verified'})
        await DataModel.updateOne({email: UserEmail}, {profileStatus: 'approved'})
        res.status(200).json({status: 'success', message: 'Your account has been approved'})
    }else{
        res.status(200).json({status: 'failed', message: 'It seems to be you aren\'t authorize user'})
    }
}

exports.userEmailOTPVerification = async (req, res) => {
    let data = await userOTPVerificationService(req, DataModel, OTPModel)
    let UserEmail = req.params.email;
    if(data === true){
        // await OTPModel.updateOne({UserEmail: UserEmail}, { OTPStatus: 'verified'})
        // await DataModel.updateOne({email: UserEmail}, {profileStatus: 'approved'})
        res.status(200).json({status: 'success', message: 'OTP Verification success'})
    }else{
        res.status(200).json({status: 'Unauthorized', message: 'It seems to be you aren\'t authorize user'})
    }
}

exports.userLogin = async (req, res) => {
    let data = await userLoginService(req, DataModel)
    if(data.status === "success"){
        let CookieOption = {
            expires: new Date(Date.now() + 24*60*60*1000),
            httpOnly: false
        }
        res.cookie('token', data['token'], CookieOption)
        res.status(200).json(data)
    }else{
        res.status(200).json(data)
    }
}

exports.userUpdate = async (req, res) => {
    let data = await userUpdateService(req, DataModel)
    res.status(200).json(data)
}

exports.userPassReset = async (req, res) => {
    try{

        const email = req.params.email
        const otp = req.params.otp
        const PostBody = req.body
        let OTPMatch = await OTPModel.aggregate([{$match: {UserOTP: otp, OTPStatus: 'verified'}}, {$count: 'count'}])
        if(OTPMatch[0]['count'] !== 1){
            res.status(200).json({status: 'Unverified', message: 'Before verified your otp'})
        }else{
            await OTPModel.deleteOne({UserOTP: otp, OTPStatus: 'verified'})
            await DataModel.updateOne({email: email}, {$set: PostBody})
            res.status(200).json({status: 'success', data: 'New password saved'})
        }

    }catch(err){
        res.status(200).json({status: 'field', data: err.toString()})
    }

}

exports.userProfileDetails = async (req, res) => {
    try{
        let UserDetails = JSON.parse(req.headers['UserDetails'])
        let data = await DataModel.aggregate([{$match: {_id: new mongoose.Types.ObjectId(UserDetails['user_id'])}}, {$project: { _id:0, email: 1, mobile: 1, fullName: 1, address: 1, country: 1, password: 1, sortDes: 1, userPhoto: 1, profileStatus: 1, userRole: 1, createdDate: 1}}])
        if(data.length>0){
            res.status(200).json({status: 'success', data: data[0]})
        }else{
            res.status(200).json({status: 'failed'})
        }
    }catch(err){
        res.status(200).json({status: 'failed', data: err.toString()})
    }
}

exports.userList = async (req, res) => {
    let searchRegex = {"$regex": req.params.keyword, "$options": "i"}
    let SearchKeywords = {$or: [{fullName: searchRegex}, {address: searchRegex}, {country: searchRegex}]}
    let data = await CommonListService(req, DataModel, SearchKeywords)
    res.status(200).json(data)
}

exports.UserDetailsById = async (req, res) => {
    try {
        let UserId = req.params.id;
        let data = await DataModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(UserId)}}
        ])
        res.status(200).json({status: 'success', data: data})
        
    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}

exports.userListByRole = async (req, res) => {
    try {
        let RoleText = req.params.RoleText;
        let data = await DataModel.aggregate([
            {$match: {userRole: RoleText}},
            {
                $facet: {
                    Total: [{$count: 'Total'}],
                    Rows: [{$limit: Number(100)}]
                }
            }
        ])
        res.status(200).json({status: 'success', data: data})
    } catch (error) {
        res.status(200).json({status: 'failed', data: error})
    }
}

exports.deleteUserAccount = async (req, res) => {
    try {

        const id = req.params.DeleteId;
        let UserDetails = JSON.parse(req.headers['UserDetails'])
        let role = await DataModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(id)}}
        ])

        // console.log(UserDetails)

        if(UserDetails['userRole'] === 'administrator' && role[0]['userRole'] !== 'administrator'){
            let data = await DataModel.deleteOne({_id: id})
            res.status(200).json({status: 'success', message: 'The user has been deleted', data: data})
        }else{
            res.status(200).json({status: 'admin', message: 'You can\'t make remove yourself'})
        }
    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}

exports.userUpdateByAdmin = async (req, res) => {
    try {
        let id = req.params.id;
        let PostBody = req.body;
        let UserDetails = JSON.parse(req.headers['UserDetails'])
        let UserCount = await DataModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(UserDetails['user_id'])}}
        ])
        if(UserCount[0]['userRole'] === 'administrator'){
            await DataModel.updateOne({_id: new mongoose.Types.ObjectId(id)}, {$set: PostBody})
            res.status(200).json({status: 'success', data: 'User profile updat success'})
        }else{
            res.status(200).json({status: 'not', data: null})
        }

    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}