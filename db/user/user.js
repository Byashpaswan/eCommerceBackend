const mongoose=require('mongoose')
const User=require('../model/user/user.modal.js');

User.statics.getAllUsers=async function() {
    return await this.find();
};

User.statics.getUserById=async function(filter) {
      return await this.findOne(filter)
}

User.statics.createUser=async function(userData) {
    const newUser = new this(userData);
    return await newUser.save();
}

User.statics.updateUser=async function(filter,updateData){
    return await this.findOneAndUpdate(filter, updateData, { new: true });
}
module.exports=mongoose.model('User',User);



