/* PRODUCTS route*/

const express = require("express");
const router = express.Router();
const { database } = require("../config/helpers")

/* GET ALL PRODUCTS */

router.get("/", function (req, res) {

     //get the current page number from the query
     let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1;

     //set the limit of items per page
     const limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit : 10;

     let startValue;
     let endValue;

     //if we specify a page in the query (for example localhost?page=2), the elements from id 11 to id 20 will apear

     if (page > 0) {
          startValue = (page * limit) - limit; //multiple of 10 - 0,10,20,30
          endValue = page * limit;
     }
     else {
          //default
          startValue = 0;
          endValue = 10;
     }

     //get the products table joined with the categories table, sorted by id
     database.table("products as p")
          .join([{
               table: "categories as c",
               on: "c.id = p.cat_id"
          }])
          .withFields(["c.title as category", "p.title as name", "p.price", "p.quantity", "p.image", "p.id", "p.description"])
          .slice(startValue, endValue)
          .sort({ id: .1 })
          .getAll()
          .then(prods => {
               if (prods.length > 0) {
                    res.status(200).json({
                         count: prods.length,
                         products: prods
                    });
               } else {
                    res.json({ message: "No products found" });
               }
          }).catch(err => console.log(err));

})

/* GET A SINGLE PRODUCT*/
router.get("/:productId", (req, res) => {
     let productId = req.params.productId;
     console.log(productId)

     //get the products table joined with the categories table
     database.table("products as p")
          .join([{
               table: "categories as c",
               on: "c.id = p.cat_id"
          }])
          .withFields(["c.title as category", "p.title as name", "p.price", "p.quantity", "p.image", "p.images", "p.id", "p.description"])
          //get the product with the suitable id
          .filter({"p.id" : productId})
          .get()
          .then(prod => {
               if (prod) {
                    res.status(200).json({prod });
               } else {
                    res.json({ message: "No product with id "+productId+" found" });
               }
          }).catch(err => console.log(err));

})

/* GET ALL PRODUCTS FROM ONE PARTICULAR CATEGORY*/
router.get("/category/:categoryName",(req,res)=>{
      //get the current page number from the query
      let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1;

      //set the limit of items per page
      const limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit : 10;
 
      let startValue;
      let endValue;
 
      //if we specify a page in the query (for example localhost?page=2), the elements from id 11 to id 20 will apear
 
      if (page > 0) {
           startValue = (page * limit) - limit; //multiple of 10 - 0,10,20,30
           endValue = page * limit;
      }
      else {
           //default
           startValue = 0;
           endValue = 10;
      }
 
      //fetch the category name from the URL
      const categoryTitle = req.params.categoryName;

      //get the products table joined with the categories table, sorted by id with the suitable category
      database.table("products as p")
           .join([{
                table: "categories as c",
                on: `c.id = p.cat_id WHERE c.title = '${categoryTitle}'`
           }])
           .withFields(["c.title as category", "p.title as name", "p.price", "p.quantity", "p.image", "p.id","p.description"])
           .slice(startValue, endValue)
           .sort({ id: .1 })
           .getAll()
           .then(prods => {
                if (prods.length > 0) {
                     res.status(200).json({
                          count: prods.length,
                          products: prods
                     });
                } else {
                     res.json({ message: "No products found from "+categoryTitle+" category" });
                }
           }).catch(err => console.log(err));
})


module.exports = router;