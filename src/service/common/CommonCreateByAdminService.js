
const CommonCreateByAdminService = async (Request, DataModel, UserModel) => {
    try{
        let UserDetails = JSON.parse(Request.headers['UserDetails'])
        let PostBody = Request.body;
        PostBody.UserEmail = UserDetails['UserEmail'];
        let user = await UserModel.aggregate([
            {$match: {email: UserDetails['UserEmail']}},
            {$project: {_id: 0, userRole:1}}
        ])
        if(user[0]['userRole'] === 'administrator'){

            let data = await DataModel.create(PostBody)
            return {status: 'success', data: data}
        }else{
            return {status: 'failed', message: 'You are not eligible'}
        }
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}

module.exports = CommonCreateByAdminService;