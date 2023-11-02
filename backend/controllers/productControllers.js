//it is used for crud operation

const Product = require('../models/productModel')

const catchAsyncError = require('../middelwares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
//new product=> /api/v1/product/new
const APIFeatures = require('../utils/apiFeatures');

exports.newProducts =async(req,res)=>{
    try{   

        //for jo login kare uski id dikhe//doubt
        req.body.user = req.user.id;
      
    const Newproduct = await Product.create(req.body);
    res.status(201).json({
        success: true,
        Newproduct
    })
}catch(error){
    console.error('Error saving data:', error);
}
}


exports.getAllProducts = async(req,res,next)=>{

    try{
          const Allproduct = await Product.find();
          res.status(200).json(Allproduct)
    }catch(error){
        res.status(500).json({ error: 'Failed to get product' });
    }

}

exports.getProdcutById = catchAsyncError(async(req,res,next)=>{
    
       try{ 
         const productById = await Product.findById(req.params.productId);
        
         if(!productById)
         {
            return next(new ErrorHandler('product not found',404));

         }
         res.status(200).json({
            success:true,
            productById
         }
            )
    }catch(error){
        console.log(error);
        return next(new ErrorHandler('Failed to get product',500));
         //res.status(500).json({error: "Failed to get product"});
    }
})

exports.UpdateProduct = async(req,res,next)=>{
    try{
        const productId = req.params.productId;
        const updatedData = req.body;
        console.log(updatedData);
           const UpdateProduct = await Product.findByIdAndUpdate(productId,updatedData);

            
           if(UpdateProduct)
           {
            res.status(200).json(UpdateProduct);
           }else{
            res.status(404).json({error: "product not found"});
           }
    }catch(error)
    {
        res.status(500).json({error:"Failed to update the product"});
    }
}

exports.DeleteById = async(req,res)=>{
    try{

              const productId = req.params.productId;
              const deletedData = await Product.findByIdAndRemove(productId);

              if(deletedData)
              {
                res.status(200).json(deletedData);
              }else{
                res.status(404).json({error:"product not foudn"});
              }
    }catch(error){
        
         res.status(500).json({error:"Failed to delete the data"});
    }
}

exports.SearchProduct = async(req,res)=>{ 
try {
    
        
        const resPerPage = 4;
        const productCount = await Product.countDocuments();
        const apiFeatures = new APIFeatures(Product.find(),req.query)
                            .search()
                           .filter()
                          .pagination(resPerPage)
        // console.log(req.query);
        //console.log(Product.find());
                            
        const products = await apiFeatures.query;
 

        console.log(productCount);
            res.status(200).json({
                success:true,
                products,
                productCount,
                resPerPage
               
            });
     
         
   
        
}
        catch (error) {
                    console.log(error);
        }
}
