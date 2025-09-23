var Userdb = require('../model/model');

// create and save new user
exports.create = (req, res) => {
    // validate request
    if(!req.body) { 
        res.status(400).send({ message: 'Content cannot be empty'});
    }

    // new user
    const user = new Userdb({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        status: req.body.status
    });

    // save user in the database
    user.save(user)
        .then((data) => {
            res.status(201).json({'message': "User created succesfully", 'data': data});
        })
        .catch(err => {
            res.status(500)
                .send({ message: err.message || "Some error occured while creating a create operation"});
        });
};

    // retrieve and return all users/ retrieve and return a single user
exports.find = (req,res) => {
    if(req.query.id){
        const id = req.query.id;
        Userdb.findById(id)
            .then(data => {
                if(!data){
                    res.status(404).send({message:"Not found user with id "+id})
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({message:"Error retrieving user with id "+id})
            })
    } else {
        Userdb.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({message:err.message|| "Error occured while retrieving user information"})
            })
        }
};

//update user by id
exports.update = (req,res) => {
    console.log('update: ' + req.body);
    if(!req.body) {
        return res
            .status(400)
            .send({message:"Data to update cannot be empty"})
    }

    const id = req.params.id;
    
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify:false })
        .then(data => {
            if(!data){
                res.status(404).send({ message: "Cannot update user with ${id},Maybe user not found"})
            }
            else{
                res.send({ 'message': "User updated succesfully", 'data': data });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error update user information"})
        });
};

// delete user by id
exports.delete = (req, res) => {
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then( data => {
            if (!data) {
                res.status(404).send({ message: 'Cannot delete with id ${id), Maybe id is wrong'});
            } else {
                res.send({ message: "User was deleted succesfully"});
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Could not delte use with id = " + id});
        })
};
