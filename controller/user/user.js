const User=require('./../../db/user/user')
const bcrypt = require('bcrypt');






exports.getAllUsers=async(req,res)=>{
    try {
        const users = await User.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getUserById=async(req,res)=>{
    try {
          if(req.params.id!==undefined && req.params.id!==null){
           const user = await User.getUserById({ _id: req.params.id });
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
           }
           res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.createUser=async(req,res)=>{
    try {
        console.log("req.body--",req.body)
        if(req.body === undefined || req.body === null) {
            return res.status(400).json({ message: 'Invalid user data' });
        }

         if(req.body.email){
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
         }
         if(!req.body.name || !req.body.email) {
             return res.status(400).json({ message: 'Name and email are required' });
         }

         const salt=bcrypt.genSaltSync(10);
        //  console.log("salt--",salt)
        //  console.log("req.body.password--",req.body.pass)
         const hashedPassword=bcrypt.hashSync(req.body.pass,salt);

        // const newUser = await User.createUser({...req.body,password:hashedPassword});
        const newUser = await User.createUser({
            name: req.body.name,
            email: req.body.email,
            pass: hashedPassword,
            age: req.body.age,
            address: req.body.address,
            role:req.body.role || 'user',
            phone: req.body.phone
        });
        if (!newUser) {
            return res.status(400).json({ message: 'Error creating user' });
        }       
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.loginUser=async(req,res)=>{
    try {
        if(!req.body.email || !req.body.pass) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.getUserById({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = bcrypt.compareSync(req.body.pass, user.pass);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




exports.updateUser=async(req,res)=>{
    try {
        if(req.params.id === undefined || req.params.id === null) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const updatedUser = await User.updateUser({ _id: req.params.id }, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}