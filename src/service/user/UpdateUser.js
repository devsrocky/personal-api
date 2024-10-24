
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const userUpdateService = async (Request, DataModel) => {
    try{
        let UserDetails = JSON.parse(Request.headers['UserDetails'])
        let PostBody = Request.body;
        let data = await DataModel.updateOne({_id: new ObjectId(UserDetails['user_id']), email: UserDetails['UserEmail']}, PostBody)
        return {status: 'success', message: 'Profile saved', data: data}
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}

module.exports = userUpdateService;