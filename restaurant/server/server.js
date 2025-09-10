const PROTO_PATH="./restaurant.proto";

const mongoose = require("mongoose");
const Menu = require("../models/Menu");

//var grpc = require("grpc");
var grpc = require("@grpc/grpc-js");

var protoLoader = require("@grpc/proto-loader");

mongoose.connect("mongodb+srv://Sukon:SuK014mongodb@cluster0.h0b2by2.mongodb.net/")
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

var packageDefinition = protoLoader.loadSync(PROTO_PATH,{
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

var restaurantProto =grpc.loadPackageDefinition(packageDefinition);

const {v4: uuidv4}=require("uuid");

const server = new grpc.Server();
const menu=[
    {
        id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        name: "Tomyam Gung",
        price: 500
    },
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        name: "Somtam",
        price: 60
    },
    {
        id: "8551887c-f82d-4e44-88ca-ae2a1ccc92b7",
        name: "Pad-Thai",
        price: 120
    }
];
server.addService(restaurantProto.RestaurantService.service, {
  getAllMenu: async (_, callback) => {
    try {
      const menus = await Menu.find();
      callback(null, { menu: menus });
    } catch (err) {
      callback(err, null);
    }
  },

  get: async (call, callback) => {
    try {
      const menuItem = await Menu.findById(call.request.id);
      if (menuItem) {
        callback(null, menuItem);
      } else {
        callback({ code: grpc.status.NOT_FOUND, details: "Not found" });
      }
    } catch (err) {
      callback(err, null);
    }
  },

  insert: async (call, callback) => {
    try {
      const menuItem = new Menu(call.request);
      await menuItem.save();
      callback(null, menuItem);
    } catch (err) {
      callback(err, null);
    }
  },

  update: async (call, callback) => {
    try {
      const updated = await Menu.findByIdAndUpdate(
        call.request.id,
        { name: call.request.name, price: call.request.price },
        { new: true }
      );
      if (updated) {
        callback(null, updated);
      } else {
        callback({ code: grpc.status.NOT_FOUND, details: "Not Found" });
      }
    } catch (err) {
      callback(err, null);
    }
  },

  remove: async (call, callback) => {
    try {
      const deleted = await Menu.findByIdAndDelete(call.request.id);
      if (deleted) {
        callback(null, {});
      } else {
        callback({ code: grpc.status.NOT_FOUND, details: "Not Found" });
      }
    } catch (err) {
      callback(err, null);
    }
  }
});

// server.addService(restaurantProto.RestaurantService.service,{
//     getAllMenu: (_,callback)=>{
//         callback(null, {menu});
//     },
//     get: (call,callback)=>{
//         let menuItem = menu.find(n=>n.id==call.request.id);

//         if(menuItem) {
//             callback(null, menuItem);
//         }else {
//             callback({
//                 code: grpc.status.NOT_FOUND,
//                 details: "Not found"
//             });
//         }
//     },
//     insert: (call, callback)=>{
//         let menuItem=call.request;

//         menuItem.id=uuidv4();
//         menu.push(menuItem);
//         callback(null,menuItem);
//     },
//     update: (call,callback)=>{
//         let existingMenuItem = menu.find(n=>n.id==call.request.id);

//         if(existingMenuItem){
//             existingMenuItem.name=call.request.name;
//             existingMenuItem.price=call.request.price;
//             callback(null,existingMenuItem);
//         } else {
//             callback({
//                 code: grpc.status.NOT_FOUND,
//                 details: "Not Found"
//             });
//         }
//     },
//     remove: (call, callback) => {
//         let existingMenuItemIndex = menu.findIndex(n=>n.id==call.request.id);

//         if(existingMenuItemIndex != -1){
//             menu.splice(existingMenuItemIndex,1);
//             callback(null,{});
//         } else {
//             callback({
//                 code: grpc.status.NOT_FOUND,
//                 details: "NOT Found"
//             });
//         }
//     }
// });

server.bindAsync("127.0.0.1:30043",grpc.ServerCredentials.createInsecure(), ()=>{server.start();});
console.log("Server running at http://127.0.0.1:30043");
