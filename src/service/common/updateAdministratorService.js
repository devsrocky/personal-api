const mongoose = require('mongoose')

const updateAdministratorService = async (Request, DataModel, UserModel) => {
    try{
        let UserDetails = JSON.parse(Request.headers['UserDetails'])
        let id = Request.params.id;
        let PostBody = Request.body;
        let user = await UserModel.aggregate([
            {$match: {email: UserDetails['UserEmail']}},
            {$project: {_id: 0, userRole:1}}
        ])
        if(user[0]['userRole'] === 'administrator'){
            let data = await DataModel.updateOne({_id: new mongoose.Types.ObjectId(id)}, PostBody)
            return {status: 'success', data: data}
        }else{
            return {status: 'Sorry', message: 'You aren\'t eligible for it'}
        }
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}

module.exports = updateAdministratorService