const mongoose = require('mongoose')
let ObjectId = mongoose.Types.ObjectId;

const CommonDeleteByAdminService = async (Request, PortfolioModel, UserModel) => {
    try{

        let DeleteId = Request.params.DeleteId;
        let UserDetails = JSON.parse(Request.headers['UserDetails'])

        let user = await UserModel.aggregate([
            {$match: {email: UserDetails['UserEmail']}}
        ])
    
        if(user[0]['userRole'] === 'administrator'){
            let data = await PortfolioModel.deleteOne(new ObjectId(DeleteId))
            return {status: 'success', message:'The portfolio has been deleted', data: data}
        }else{
            return {status: 'failed', message: 'You are not eligible'}
        }

        // return {status: 'success', data: UserDetails}

    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}

module.exports = CommonDeleteByAdminService;