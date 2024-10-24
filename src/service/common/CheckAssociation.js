

const CheckAssociation = async (QueryObject, DataModel) => {
    try{

        let data = await DataModel.aggregate([
            {$match: QueryObject}
        ])
        return data.length > 0

    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}

module.exports = CheckAssociation;