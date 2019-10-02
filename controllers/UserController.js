const User = require('../models/User');

exports.createUser = async function(req, res, next){
  try{
    const user = new User();
    user.name = req.body.name;
    await user.save();
  }catch (error) {
    console.log(error)
    return res.status(400).json({ status: 400, message: JSON.stringify(error)});
  }

  return res.status(200).json({ status: 200, data: "user", message: "test"});
}

exports.getUser = async function(req, res, next){
  try{
  const users = await User.find({});
  return res.status(200).json(users);
  }catch (error) {
    return res.status(400).json({ status: 400, message: JSON.stringify(error)});
  }
 }
