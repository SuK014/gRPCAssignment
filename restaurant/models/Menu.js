// import mongoose from "mongoose";

// const menuItemSchema = new mongoose.Schema({

//     name: {
//         type :String,
//         required : true,
//         trim : true,
//     },
//     price :{
//         type : Number,
//         required : true,
//         min : 0
//     }
// }, {timestamps :true });

// // module.exports = mongoose.model("Menu", MenuSchema);

// const MenuItem = mongoose.model("Menu",menuItemSchema);

// export default MenuItem;
const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Menu", MenuSchema);
