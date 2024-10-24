const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const DeliveryService = async (Request, DeliveryModel, UserModel, UserDetails) => {
    try{
        let id = Request.params.id;
        let DeliveryStatus = 'Accepted';
        let user = await UserModel.aggregate([
            {$match: {email:UserDetails['UserEmail']}}
        ])
        if(user[0]['userRole'] === "administrator" || user[0]['userRole'] === "buyer"){
            let modified = await DeliveryModel.updateOne({_id: new ObjectId(id)}, {DeliveryStatus: DeliveryStatus})
            if(modified['modifiedCount'] === 1){
                return true
            }
            return {status: 'failed', message: 'Something went wrong with order acception'}
        }else{
            return {status: 'failed', message: 'Your are not eligible'}
        }
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}


module.exports = DeliveryService;