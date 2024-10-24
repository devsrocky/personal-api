const { default: mongoose } = require('mongoose')
const DataModel = require('../../model/appointment/AppointmentModel')
const UserModel = require('../../model/user/UserModel')
const createAppointmentService = require('../../service/appointment/createAppointmentService')
const deleteAppointmentService = require('../../service/appointment/deleteAppointmentService')
const CommonDeleteByAdminService = require('../../service/common/CommonDeleteByAdminService')
const CommonListService = require('../../service/common/CommonListService')
const updateAdministratorService = require('../../service/common/updateAdministratorService')



exports.CreateAppointment = async (req, res) => {
    let data = await createAppointmentService(req, DataModel)
    res.status(200).json(data)
}

exports.updateAppointment = async (req, res) => {
    let data = await updateAdministratorService(req, DataModel, UserModel)
    res.status(200).json(data)
}

exports.ListOfAppointment = async (req, res) => {

    let SearchRegex = {"$regex": req.params.keyword, "$options": "i"}
    let SearchArray = {$or: [{YourName: SearchRegex}, {YourPhone: SearchRegex}, {Nich: SearchRegex}, {Status: SearchRegex}, {ProjectType: SearchRegex}]}

    let data = await CommonListService(req, DataModel, SearchArray)
    res.status(200).json(data)

}

exports.deleteAppointment = async (req, res) => {
    let data = await CommonDeleteByAdminService(req, DataModel, UserModel)
    res.status(200).json(data)
}

exports.AppointmentsByStatus = async (req, res) => {
    try {
        let status = req.params.status;
        let data = await DataModel.aggregate([
            {$match: {Status: status}}
        ])
        res.status(200).json({status: 'success', data: data})

    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}

exports.AppointmentDetailsById = async (req, res) => {
    try {
        let id = req.params.id;
        let data = await DataModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(id)}}
        ])
        res.status(200).json({status: 'success', data: data[0]})
    } catch (error) {
        res.status(200).json({status: 'failed', data: error.toString()})
    }
}