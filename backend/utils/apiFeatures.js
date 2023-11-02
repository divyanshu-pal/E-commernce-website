class APIFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {

            name:{
                $regex : this.queryStr.keyword,
                $options:'i'//case-insensitivve
            }
        }:{}
        console.log(keyword);
       // console.log(this.query)
        this.query = this.query.find({  ...keyword});//product.find() contain all product then this.query.find() sort all the product related to keyword and send
        
       // console.log(this.query);
       //console.log(this)
        return this;
    }

    //http://localhost:2000/api/v1/search?keyword=r&category=Electronics
    filter(){
        ///&category=Electronics
        const queryCopy = {...this.queryStr};

        //Removing feilds from str copy
        //console.log(queryCopy);
       const removeFields = ['keyword','limit','page']
        removeFields.forEach(el=> delete queryCopy[el]);
        //Advance filter for price,rating etc
        
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g,match => `$${match}`);


        
        console.log(queryStr);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;

    }

    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page)||1;
        const skip = resPerPage *(currentPage -1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
}


module.exports = APIFeatures;