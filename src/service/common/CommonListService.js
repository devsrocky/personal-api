
const CommonListService = async (Request, DataModel, SearchKeywords) => {
    try{

            let pageNo = Number(Request.params.pageNo)
            let perPage = Number(Request.params.perPage)
            let SearchValue = Request.params.keyword

            // let RowSkip = (pageNo - 1) * perPage;
            let RowSkip = (pageNo -1 )* perPage
            let data;
                if(SearchValue !== "0"){
                    data = await DataModel.aggregate([
                        {$match: SearchKeywords},
                        {
                            $facet: {
                                Total: [{$count: 'Total'}],
                                Rows: [{$skip: Number(RowSkip)}, {$limit: perPage}]
                            }
                        }
                    ])
                }else{
                    data = await DataModel.aggregate([
                        {
                            $facet: {
                                Total: [{$count: 'Total'}],
                                Rows: [{$skip: RowSkip}, {$limit: perPage}]

                            }
                        }
                    ])
                }
        return {status: 'success', data: data}
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}

module.exports = CommonListService;