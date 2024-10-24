const mongoose = require('mongoose')
const deleteAppointmentService = async (Request, DataModel, UserModel) => {
    try{
        let UserDetails = JSON.parse(Request.headers['UserDetails'])
        let id = Request.params.id;
        let user = await UserModel.aggregate([
            {$match: {email: UserDetails['UserEmail']}},
            {$project: {_id: 0, profileStatus:1}}
        ])
        if(user[0]['profileStatus'] === 'approved'){
            let data = await DataModel.deleteOne({_id: new mongoose.Types.ObjectId(id)})
            return {status: 'success', message: 'Appointment deleted', data: data}
        }else{
            return {status: 'Sorry', message: 'You aren\'t eligible for it'}
        }
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}
module.exports = deleteAppointmentService;