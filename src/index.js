const app = require('./app');
const event = require('./event');
const http = require('http')
const server = http.createServer(app);
const { Server } = require("socket.io");
const port =  9091; //9091// 5000process.env.PORT || 
const eventAwait = event()
const io = new Server(server)

const {createClient} = require('redis');

let onlineUsers = [].filter(item => item != undefined);
// michaelraffin
// url: 'redis://alice:foobared@awesome.redis.server:6380'
const client = createClient({
  password: 'BlnGrxidVpaJhnNuUb7zvifngmukC7wW',
  socket: {
      host: 'redis-17791.c257.us-east-1-3.ec2.cloud.redislabs.com',
      port: 17791
  }
})

// async function runRedis(){

// try {
//   client.on('error', err => console.log('Redis Client Error', err));
//   let socketConnect = await client.connect().catch(console.error)
//   console.log('ajjj',socketConnect)
//   return socketConnect
// } catch (error) {
//   console.log('error run redis')
// }
// }

async function setData(id,data){
        try {
          console.log('setData',id)
          await client.lPush(id, data);
          
        } catch (error) {
          console.log('errror setData ',error)
          return
        }
}
async function retreiveData(key){
  try{
console.log('key retreiveData',key)
// await client.get
 let results =  await  client.lRange(key,0,10)
// let results = await client.flushAll()
    return results
  } catch(error){
    console.log('errror retreiveData ',error)
  }
}
io.on('connection', (socket) => { 
      let userId = socket.handshake.query.userid
client.on('error', err => console.log('Redis Client Error', err));
      // ** User must join in a room of online **// 
      socket.on("chatUser-Init",(data,callback)=>{
          let room = `room-chatUser-${data.payload.idRoom}`
          console.log('New message found   user chat init',room)
            try {
            socket.join(room) 
            callback({ room:room, status:true,message:`Message has been sent`,
            type:'init',
            bodyMessage:data.payload.message}) 
            } catch (error) {
              
            }
})

      // send message
      socket.on("chatUser",(data,callback)=>{
        try {
          console.log('payload',data)
        let room = `room-chatUser-${data.payload.idRoom}`
        console.log('new message',data.payload)
        socket.join(room) // ** User must join in a room of online **//
        socket.to(room).emit("messageChat",{payload:data.payload})
        console.log('callback',callback)
        callback({ room:room, status:true,message:`Message has been sent`,bodyMessage:data.payload.message})
        } catch (error) {
          console.log(error,data)
          callback({status:'error'})
        }
      })

      socket.on("onlineUser",(data,callback)=>{
        console.log('new user found',data.payload.coordinates)
        console.log('new user found',userId)
        let room = `room-onlineUser-${data.payload.country}`
        socket.join(room) // ** User must join in a room of online **//
        let findUsers = onlineUsers.find(element => element === userId)  
        if ( findUsers === undefined) {
            onlineUsers.push(userId)
            
            socket.to(room).emit("newJoiner",{data:data,availableDrivers:onlineUsers.length})

           setData('onlineUser',JSON.stringify(data.payload))
           retreiveData('onlineUser').then((users)=>{
            console.log('available users',users)
            callback({
              room:room,
              online:users,
              status:true,message:`You are now connected to room online user  ${data.payload.source}`,availableDrivers:onlineUsers.length})
           })
           
          
           console.log('user has been added',userId , "   " , "available user: " , onlineUsers)

        } else {
            socket.to(room).emit("newJoiner",{data:data,availableDrivers:onlineUsers.length})
           callback({
            room:room,
            status:true,message:`Has been added before  ${data.payload.source}`,availableDrivers:onlineUsers.length})
        }
      
        })

        socket.on("viewLoads",(data,callback)=>{
          console.log('data viewLoads',data)
        })
    socket.on("placeBid",(data,callback)=>{
      console.log('place bid')
      callback({status:true,message:`Bid has been sent `})
      // io.emit("bidSuccess",data)
       socket.broadcast.emit("bidSuccess",data)
        })
  socket.on("join",(data,callback)=>{
    console.log('Join to',data)
    // socket.join("room1")
    let room = `room-${data.room}`
    socket.join(room)
    callback({status:true,message:`succesfully connected to  ${room}`})
    socket.to(room).emit("newJoiner",{data:data})
    })
 
    
        socket.on("load-stats-watcher",(data,callback)=>{
          console.log('load-stats-watcher',data)
        })


        //User View particualr load then notify owner via "load-state" that someone is watching

        socket.on("load-booking-watcher",(data,callback)=>{
          console.log('load-booking-watcher',data.payload.room)
          let room = `room-${data.payload.room}` 
          socket.join(room)
          socket.to(room).emit("load-state",data)
          console.log('data.payload.room')
          callback({status:true,message:`succesfully connected to  ${room}`})
        })
 
        /// DID Accept but different Socket
        socket.on("load-booking-didAccept",(data,callback)=>{
          let room = `room-${data.payload.room}` 
          socket.to(room).emit("load-state",data)
        })


        /// DID Deleted but different Socket
        socket.on("load-booking-didDeleted",(data,callback)=>{
          let room = `room-${data.payload.room}` 
          socket.to(room).emit("load-state",data)
        })

                                   //Phase 
                                socket.on("load-state-follow",(data,callback)=>{
                                    let id = `load-watcher`
                                    let room = `room-${data.payload.room}`
                                    socket.to(room).emit(id,data)
                                    console.log('load-state-follow',data)
                                    callback({status:true,message:`You are messag was sent to room ${data.room}`})
                                })
                          

                                //Phase 1 
                                socket.on("notify-city-group",(data,callback)=>{
                                  console.log('notify-city-group',data)
                                    let id = `load-watcher`
                                    let room = `room-${data.payload.room}`
                                    socket.to(room).emit(id,data)
                                    console.log('emit to id: ',id)

                                setData('id',JSON.stringify(data.payload))
                                // JSON.stringify(data.payload)
                                // retreiveData('onlineUser').then(()=>{
                                //   callback({status:true,message:`You are messag was sent to room ${data.room}`})
                                // })
                               
                                })
  



      socket.on("load-state",(data,callback)=>{
        console.log('load-state payload',data)
          let id = `load-watcher-${data.payload.reference}`
          let room = `room-${data.room}`
          // io.in(room).emit(id,data)
          // io.in(room).emit(id,data)
          socket.to(room).emit(id,data)
          callback({status:true,message:`You are messag was sent to room ${data.room}`})
      })


        //OLD
    //   socket.on("join",(data,callback)=>{
    //   console.log('user is watcher',data)

    //   if (data.payload != undefined)    {
    //     console.log('reference',data.payload.reference)
    //     let id = `load-watcher-${data.payload.reference}`
    //     console.log('id',id)
    //     let room = `room-${data.room}`
    //     io.in(room).emit(id,data)
    //     } else {
    //       io.in(room).emit(data.room,data)
    //     }
        
    //   callback({status:true,message:`You are connect to ${data.room}`})
    // })


    //** LoggedOut  **//
    socket.on("userLoggedOut",(data,callback)=>{
      let room = `room-onlineUser-${data.payload.country}`
      console.log('user did loggedout',room)

      onlineUsers = onlineUsers.filter(user => user != userId )
      console.log('userId',userId)

      console.log('userId',userId)
      callback({status:true,message:`You are now now loggedout available user `})

      //Notify Users
      socket.to(room).emit("userDidLoggedOut",{data:data.payload,removeUser:userId,availableDrivers:onlineUsers.length,room:room})
      socket.leave(room)
      })



      
 // ** Dynamic  Leave-Room  **//
      socket.on("dynamic-leave-room",(data,callback)=>{
        console.log('leave-room ',data.payload.room)
        let room =  `${data.payload.room}`
        socket.join(room) // ** User must join in a room of online **//
        // socket.to(room).emit("messageChat",{message:'user did logout'})
        socket.leave(room)
        // onlineUsers = onlineUsers.filter(user => user != userId )
        callback({status:true,message:`User has been left the room ${data.payload.room}`})
      })


            
      // ** Leave-Room  **//
      socket.on("leave-room",(data,callback)=>{
          try {
            let roomWatcher = `load-watcher-${data.payload.reference}`
            let room =  `room-${data.room}`
            socket.leave(room)
            socket.leave(roomWatcher)
            onlineUsers = onlineUsers.filter(user => user != userId )
            callback({status:true,message:`user has been left the ${data.room}`})
          } catch (error) {
            console.log('error leave-room',error)
          }
      })


        socket.on("disconnected",()=>{
          console.log('a user DISCONNECTED');
        })

});
console.log('redis is running')

server.listen(port, () => {
  // runRedis()
  console.log('run Redis"')
  console.log(`Listening: http://localhost:${port}`);
});

// const { createServer } = require("http");
// const { Server } = require("socket.io");

// const httpServer = createServer();
// const io = new Server(httpServer, { /* options */ });

// io.on("connection", (socket) => {
//  console.log('someone is connected',socket)
// });

// httpServer.listen(9091);