
const userRegistrationService = async (Request, DataModel) => {
    try{
        let PostBody = Request.body;
        let data = await DataModel.create(PostBody)
        return {status: 'success', message: 'Buyer account has been created', data: data}
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}

module.exports = userRegistrationService;