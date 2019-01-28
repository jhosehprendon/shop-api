const mongoose = require('mongoose');

const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {

    Product.find().select('name price _id productImage userId').exec().then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    userId: doc.userId,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    } 
                }
            })
        }
        res.status(200).json(response)

    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}

exports.products_create_product = (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
        userId: req.body.userId
    })

    product.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created product Successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                userId: result.userId,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })

}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId
    Product.findById(id).select('name price _id productImage').exec().then(doc => {
        console.log(doc)
        
        if(doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'http://localhost:3000/products'
                }
            })
        } else {
            res.status(404).json({
                message: 'No valid entry found for that product ID'
            })
        }

    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
    
}

exports.products_update_product = (req, res, next) => {

    if(req.body.length > 1) {
        const updateOps = {}
        for(const ops of req.body ) {
            updateOps[ops.propName] = ops.value
        }
    
        var data = { $set: updateOps }
    } else {
        var data = {...req.body, productImage: req.file.path}

    }



    Product.update({ _id: req.params.productId }, data).exec().then(result => {
        // console.log(req.body)
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + req.params.productId
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}

exports.products_delete_product = (req, res, next) => {
    
    Product.remove({ _id: req.params.productId }).exec().then(result => {
        res.status(200).json({
            message: 'Product deleted'
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}