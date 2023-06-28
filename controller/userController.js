const { storage } = require("../utils/firebase");
const { isValidEmail, isValidPassword, isValidName } = require("../utils/validations");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const createUser = async (req, res) => {
  try {
    let data = req.body;
    let files = req.files[0];
    let { name, email, password, profile } = data;

    if(name) name = name.trim();
    if (!name) return res.status(400).send({ status: false, message: "please provide Name" });
    else if (!isValidName(name)) return res.status(400).send({ status: false, message: "Invalid Name Format" });
    
    if(email) email = email.trim();
    if (!email) return res.status(400).send({ status: false, message: "please provide Email" });
    else if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "invalid Email" });

    const emailQuery = `SELECT email FROM user WHERE email = '${email}'`;
    const emailCheck = await new Promise((resolve, reject) => {
      req.db.query(emailQuery, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    })
      .catch((err) => res.status(500).send({ status: false, message: err.message }));

    if (emailCheck.length !== 0) {
      return res.status(400).send({ status: false, message: "Email already exists" });
    }

    if(password) password = password.trim();
    if (!password) return res.status(400).send({ status: false, message: "please provide Password" });
    else if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "password must contain min 8 characters with lower and upper case alphabets and one special character" });

    const hashedPass = await bcrypt.hash(password, 10);
    password = hashedPass;

    if (files) {
      const imageRef = ref(storage, `profile/${files.originalname}`);
      const snapshot = await uploadBytes(imageRef, files.buffer);
      const url = await getDownloadURL(snapshot.ref);
      profile = url.toString();
    }else{
      profile = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106";
    }

    const setData = `INSERT INTO  user(name,email,password,profile) VALUES("${name}","${email}","${password}","${profile}")`;
    const finalData = await new Promise((resolve,reject)=>{
      req.db.query(setData, (err, data) => {
        if (err) reject(err);
        if (data) resolve(data);
      })
    })
      .catch((err) => res.status(500).send({ status: false, message: err.message }))
    return res.status(201).send({ status: true, message: "User registered successfully" });
    
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

const signIn = async (req, res) => {
  try {
    let { email, password } = req.body;

    if(email) email = email.trim();
    if (!email) return res.status(400).send({ status: false, message: "please provide Email" });

    if(password) password = password.trim();
    if (!password) return res.status(400).send({ status: false, message: "please provide password" });

    let emailQuery = `SELECT * FROM user WHERE email = '${email}'`
    const emailCheck = await new Promise((resolve, reject) => {
      req.db.query(emailQuery, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    })
      .catch((err) => res.status(500).send({ status: false, message: err.message }))
    if (emailCheck.length == 0) return res.status(400).send({ status: false, message: `user not found for email ${email}` });

    let passwordCheck = await bcrypt.compare(password,emailCheck[0].password);
    if(!passwordCheck) return res.status(400).send({status:false,message:"incorrect password"});

    let payload = {email:email,userId:emailCheck[0].id};
    let token = jwt.sign(payload,process.env.JWT_SECRET);
    res.setHeader("x-api-key",token);

    return res.status(200).send({status:true,message:"logged in successfully", data:{token:token,name:emailCheck[0].name, profile:emailCheck[0].profile}});

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }

}

module.exports = { createUser, signIn }