const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');


router.post("/signup", (req, res, next) => {
 User.find({
 	email:req.body.email
 })
 .exec()
 .then(user =>{

 	if(user.length >= 1){
 		return res.status(409).json({
   			message: "Email already existed",
   		});
 	}else{
 		   bcrypt.hash(req.body.password, 10, (err, hash)=>{
   	if(err){
   		return res.status(500).json({
   			error: err
   		});

   	} else {

   		const user = new User({
        _id: new mongoose.Types.ObjectId(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: hash
        
    });
   	 user
        .save()

        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST request.",
                createdUser: result,
                something: "congrats"
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err,
                something: "Sorry"
            });
        });

   	}

   });
 	}
 });  
    
});


router.get("/",(req,res,next) =>{
	console.log("executing get ");
	User.find()
	.exec()
	.then(users =>{
		if(users.length > 0){
			res.status(200).json(users);
		}else{
			res.status(400).json('No data found');
		}
	})
	.catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err,
                something: "Sorry"
            });
        });

})


router.get("/:userId",(req,res,next) =>{
	const id = req.params.userId;
	User.findById(id)
	.exec()
	.then(user =>{
		if(user){
			res.status(200).json(user);
		}else{
			res.status(400).json('No data found');
		}
	})
	.catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err,
                something: "Sorry"
            });
        });

});

router.post("/login", (req, res, next) => {
 User.find({email:req.body.email})
 	.exec()
 	.then(user =>{
 			if(user.length < 1){
 				res.status(401).json({
 					message:"Email id not found"
 				});

 			}
 			bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
 				if(err){
 					res.status(401).json({
 						message:"password incorrect"
 					});
 				}
 				if(result){
 					res.status(200).json({
 						message:"Authentication success",
 						userData: user
 					});
 				}
 				res.status(401).json({
 						message:"Authentication failed"
 					});
 			});

 	})
 	.catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err,
                something: "Sorry"
            });
        });
});


router.delete("/:userId",(req,res,next) =>{
	const id = req.params.userId;
	User.remove({_id:id})
	.exec()
	.then(user =>{
		
			res.status(200).json({
				message:'user details deleted'
			});
	})
	.catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err,
                something: "Sorry"
            });
        });

});

router.patch("/:userId",(req,res,next) =>{
	const id = req.params.userId; 
	const updateopts = {};
		for(const opts of req.body){
			updateopts[opts.propName] = opts.value;

		}
		User.update({_id:id},{$set:updateopts})
		.exec()
		.then(result=>{
			res.status(200).json(result);
		})
		.catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err,
                something: "Sorry"
            });
        });

	});



module.exports = router;