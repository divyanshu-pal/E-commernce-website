const express = require('express');
const router = express.Router();

// const productControllers = require('../controllers/productControllers')
// router.get('/products', productControllers.getAllProducts );
// router.get('/products/:productId',productControllers.getProdcutById);
// router.post('/products/new',productControllers.newProducts);
// router.patch('/products/:productId',productControllers.UpdateProduct);
// router.delete('/products/:productId',productControllers.DeleteById);
// router.get('/search',productControllers.SearchProduct)


const {getAllProducts,getProdcutById,newProducts,UpdateProduct,DeleteById,SearchProduct} = require('../controllers/productControllers');

const {isAuthenticatedUser,authorizeRoles} = require('../middelwares/auth')
//authorizeRoles to access only by admin
// router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles('admin'),getAllProducts);//for testing
router.route('/admin/products').get(getAllProducts);
router.route('/products/:productId').get(getProdcutById);
router.route('/admin/products/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProducts);
//router.route('/products/new').post(newProducts);
router.route('/admin/products/:productId').patch(isAuthenticatedUser,authorizeRoles('admin'),UpdateProduct);
router.route('/admin/products/:productId').delete(isAuthenticatedUser,authorizeRoles('admin'),DeleteById);
router.route('/search').get(SearchProduct);




module.exports = router;