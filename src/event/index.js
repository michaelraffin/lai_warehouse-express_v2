const express = require('express'); 
const crypto = require("crypto");
var Jimp = require('jimp');
const fileUploader = require('express-fileupload'); 
const router = express.Router(); 
const db = require('monk')('mongodb+srv://lookyClient:michaelmichael@cluster0-ae1yv.mongodb.net/Loogy?SMECredentials=true&w=majority')
var ObjectId = require('mongodb').ObjectID;
const Pooling = db.get('Poolig')
const B2 = require('backblaze-b2');
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3")
var QRCode = require('qrcode')
var jwt = require('jsonwebtoken');
var Semaphore = require('node-semaphore-sms'); 
var moment = require('moment'); 
var sempahoreApikey = "50440f22bcac4a4826d49defd03eed3b";
var sms = new Semaphore(sempahoreApikey);
var {createClient} =  require('@supabase/supabase-js')
const { auth } = require('express-oauth2-jwt-bearer');
var RPCClient = require('@alicloud/pop-core').RPCClient;
// const Redis = require("ioredis"); 
const { CANCELLED } = require('dns');
const { Console } = require('console');
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://lookyClient:michaelmichael@cluster0-ae1yv.mongodb.net/Loogy?SMECredentials=true&w=majority";
// const redis = new Redis({
//   port: 6379, // Redis port
//   host: "127.0.0.1", // Redis host
//   //family: 4, // 4 (IPv4) or 6 (IPv6)
//   // password: "auth",
//   db: 0,
// });
//new Redis(); // uses defaults unless given configuration object
var emailServer =   'https://emailsender.loogyapi.digital' /////'http://192.168.1.148:9092'
const supabaseUrl = 'https://qthtoedmibuvqobvxagd.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDA4NDI2NywiZXhwIjoxOTU1NjYwMjY3fQ.xolRkFiSZYYgBKQkH4NzNstJJVPtABmJBQwFtAHgDg0"
const supabase = createClient(supabaseUrl, supabaseKey)
const b2 = new B2({
  applicationKeyId: '000811d5e91ed390000000002', // or accountId: 'accountId'
  applicationKey: 'K000NhvAf5VPIpTHWjyYcQX0uJGorhk' // or masterApplicationKey
}); 
var params = {
  Body: "The contents of the fil\e",
  Bucket: 'https://localflowershop.sgp1.digitaloceanspaces.com', // "https://nidz.fra1.digitaloceanspaces.com",
  Key: "pMbv9vaiDxkOLkjoYnYvIJXEi6Moag8etgcCv3OUAlg",
};


aws.config.update({
  accessKeyId: 'HHAEL6AYSIVEU2CKJHKB',
  secretAccessKey: 'Z7PAOdiRWioaBCF8RdTMq1lqYBothtAeuSJ9JUXRe1Y'
}); 


const spacesEndpoint = new aws.Endpoint('https://sgp1.digitaloceanspaces.com'); //https://fra1.digitaloceanspaces.com
const s3 = new aws.S3({
  endpoint: spacesEndpoint
});
const client = new MongoClient(uri);

async function watchLocation(){

    try {
        console.log('WELCOME TO')
    } catch (error) {
        console.log(error)
    }
}

async function listDatabases(client){
  let databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

module.exports = async function watchLocation(){
  
  
    try {
      // ', '-privilege', '-username','-role','-categoryDetails'
      // ,['serviceName','description'] 
        // let db =  await client.connect();
        // const list = await  client.get('Categories').watch
        try {
          await client.connect();
          var poolingServiceCollection = client.db('Loogy').collection('LoogyPooling')
          var changeStream = poolingServiceCollection.watch([])
          changeStream.on('insert',(changes)=>{
            console.log('emitter',changes)
          })
          console.log('WELCOME TO EVENT STREAM')
          // changeStream.close()
          // await changeStream(60000)
          // console.log(client.db('Loogy').collection('LoogyPooling'))
          // Make the appropriate DB calls
          // await  listDatabases(client);

       
      } catch (e) {
          console.error(e);
      } 
        
    } catch (error) {
        console.log(error)
    }
}
;
