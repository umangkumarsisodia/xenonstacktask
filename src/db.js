const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

mongoose.connect("mongodb+srv://umang:gnVnb2nN1r0j0MKF@cluster0.93o2n.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log("Connection successfull");
})
.catch((err)=>{
    console.log(err);
});

const accountSchema = new mongoose.Schema({
    fstname : {
        type: String,
        required: true
    },

    midname : {
        type: String,
    },

    lstname : {
        type: String,
        required: true
    },

    email : {
        type: String,
        required: true
    },

    phone : {
        type: Number,
        required: true
    },

    dob : {
        type: Date,
        required: true
    },

    password: {
        type: String,
        required: true
    }
});

accountSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

const Account = new mongoose.model('Account', accountSchema);


const contactSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    query : {
        type : String,
        required: true
    }
})

const Contact = new mongoose.model('Contact', contactSchema);

module.exports = {Account, Contact};
