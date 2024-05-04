const schedule = require('node-schedule');
const db = require('monk')('mongodb+srv://lookyClient:michaelmichael@cluster0-ae1yv.mongodb.net/Loogy?SMECredentials=true&w=majority')
var notifyMichael = 'Hello Michael! has an order from MOBILE worth of ' 
var Semaphore = require('node-semaphore-sms'); 
// var moment = require('moment'); 
var moment = require('moment-timezone');
var sempahoreApikey = "50440f22bcac4a4826d49defd03eed3b";
var sms = new Semaphore(sempahoreApikey);
var moment = require('moment-timezone');

const dynamicExpoNotificationPayload = (e)=>({
   
    method: 'POST',
    uri: 'https://exp.host/--/api/v2/push/send',
    body: {
      "to": "ExponentPushToken[cvgmntITQo61KwYtxXKR5c]",
      "title":"Order Has been made",
      "body": `${e}`
    },
    json: true,
    headers: {
        'Content-Type': 'application/json'
    }
  })
  const smsNotification = (senderID,mobile,message)=>({
    method: 'POST',
    uri: 'https://api.semaphore.co/api/v4/messages',
    body: {
      "apikey":"50440f22bcac4a4826d49defd03eed3b",
      "sendername":senderID,
      "number":mobile,
      "message": message
    },
    json: true,
    headers: {
        'Content-Type': 'application/json'
    }
  })
  const notifyUser = function(owner) {
    const request = require('request-promise')
      request(dynamicExpoNotificationPayload(owner)).then(function (response){
        console.log(response)
      })
    .catch(function (err) {
        console.log('error',err);
    }) 
  } 
  const smsNotifier = function(sender,to,template) {
    const request = require('request-promise')
      request(smsNotification(sender,to,template)).then(function (response){
        console.log(response)
      })
    .catch(function (err) {
        console.log('error',err);
    }) 
  } 
  const sendSMS =async(sender,to,template)=>{
try {
    var payload = {
        from:sender,
        to: to,  
        message:template
      };
      console.log('payload',payload)
      sms.sendsms(payload, function(error, result) {
        console.log('result',result)
        if (!error) {
          console.log(result);
        } else
          console.log(error);
      }); 
} catch (error) {
    console.log('error')
}
  }
  const fetchScheduleSMS = async (id,next) => {
    try {  

      const classType = db.get("LoogyCronSMS")  
      let currentDay = moment().day(0).format('dddd')
      let currentTime = moment().format('h:mm A')  
      const list = await  classType.find({$and:[{ "approvedDay":currentDay,"time":currentTime}]}) 
      if(list.length) {
        fetchListMarketing(list[0].senderID)
        console.log(list)
      }

    }catch(error){
      console.log('error',error)
    }
  }
  const fetchListMarketing = async (id,next) => {
    const classType = db.get("LoogySMS")  
    let dateNow = moment().format('MMMM Do YYYY, h:mm:ss a')
    var phTimelog = moment().tz("Asia/Taipei").format('MMMM Do YYYY, h:mm:ss a')
    try {  
      // April 19th 2023, 10:17:00 am
      // 648be4e2dfab9cab66943c1c MMSupplies
      // 643656d8bf47d02766e7eaff Loogy
      const list = await  classType.findOneAndUpdate({_id:id}, { $push: { activityLogs:{'name':'run','date':dateNow,'phDate':phTimelog}}} ).then((docs) => {
        var result = docs
        var senderID  = result.smsMarketting.senderID
        var template  = result.smsMarketting.smsTemplate
        if (result.smsMarketting.isActive) {
            result.smsMarketting.subscribes.map(user =>{
 
            let newTemplate = template.replace("$[NAME]", user.name);
            console.log(user.mobile, "sms",newTemplate)
            // smsNotifier(senderID,user.mobile,newTemplate)
        })
        }else { 

          console.log('currently disabled',senderID)
        }
        return  {results:docs,status:docs === null ? false :true }
      })
  
     
   } catch (error) {
     console.log(error)
     next(error) 
   } 
  
  }
//   */5 * * * *
// * * * * * *
// */1 * * * *
//0 10 * * *
// 0 10 * * 1,3,5,6  (EVERY MWFS at 10AM)
// https://crontab.guru/#0_10_*_*_*
// */2 * * * * every 2mns


//  2023-24-02T00:00:00.000Z
// Good format moment("2023-06-27T00:00:00.000Z").format('MMMM Do YYYY, h:mm:ss A')

schedule.scheduleJob('0 10 * * 1,3,5,6',  function(fireDate){
  try {
      
  // RUN CRON every 2mns
  // FILTER IF SCHEDULE and TIME are correct
  // GET ID
  // RUN SMS
  
  // fetchScheduleSMS()
    console.log('fetchScheduleSMS')
      } catch (error) {
        console.log(error)
    }
  });



  // let database = [{
  //   approvedDay :[moment().day(1).format('dddd'), moment().day(3).format('dddd'), moment().day(5).format('dddd'),moment().day(0).format('dddd')],
  //   // time : moment("2023-06-23T00:50:00.000Z").format('h:mm A'),
  //   time : moment("2023-06-23T14:10:00.000Z").format('h:mm A'),
  //   senderID: "643656d8bf47d02766e7eaff"
  // }]
  
  
  // let currentDay = moment().day(0).format('dddd')
  // let currentTime = moment().format('h:mm A')
  
  // let time =  [
  //   moment("2023-06-23T00:00:00.000Z").format('h:mm:ss A'),
  // moment("2023-06-27T00:00:00.000Z").format('MMMM Do YYYY, h:mm:ss A')]
  //  let sampleDate =  moment("2023-06-23T00:00:00.000Z").format('MMMM Do YYYY, h:mm:ss A')
  
       // console.log("runtime",runtime.senderID)
      // "648be4e2dfab9cab66943c1c"
 //  console.log(sampleDate,time)
    //  console.log('This job was supposed to run everyday at  10:AM  ' + new Date());
      // console.log('date now', moment().format('MMMM Do YYYY, h:mm:ss a'))
      // let availableDates = ['April 19, 2023, 10:23:00 pm']
      //   // console.log('moment().tz("Asia/Taipei").format();',moment().tz("Asia/Taipei").format('MMMM D, YYYY, h:mm a'))
      //   if (availableDates.find(element => availableDates == "April 19, 2023, 10:23:00 pm")) {
      //     // fetchListMarketing()   
      //   }
        // fetchListMarketing()
    //  moment().format('MMMM Do YYYY, h:mm:ss a')
    // fetchListMarketing() 
    // fetchListMarketing()