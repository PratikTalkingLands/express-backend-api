const User = require("../models/user");
const bigPromise = require("../middlewares/bigPromise");
// const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require('cloudinary');

exports.signup = bigPromise(async (req, res, next) => {

  //let result;

  
  if(!req.files) {
    return next(new Error("Photo is required for signup"))
  }

  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return next(new Error("Name, email and password are required"));
  }

  let file = req.files.photo;

  const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale"
  })


  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    }
  });

  cookieToken(user, res);
});
