
const createAppointmentService = async (Request, DataModel) => {
    try{

        let PostBody = Request.body
        await DataModel.create(PostBody)
        return {status: 'success', message: 'Thank you dear for connected with us. We\'ll response in a short time'}
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}



module.exports = createAppointmentService

