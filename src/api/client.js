let io  = require("socket.io-client")
let socket = io.connect("http://192.168.1.148:9091")


let cebu = "cebu-trucking"

let room = "cebu-trucking-backload"
let payload = {reference:"D6ES6N",state:"didAccept"}
socket.on(cebu,(data)=>{ 
    console.log(`Welcome to cebu trucking room ${new Date()}`,data)
})

socket.on("load-watcher-HG2aC8",(data)=>{
    console.log('Refresh load',data)
  })


// socket.emit("load-watcher",{room:davao,payload},(callback)=>{
//     console.log(callback)
// })
socket.emit("join",{room:cebu,payload},(callback)=>{
    console.log(callback)
})
socket.emit("user-watcher",{room:cebu})             



// socket.on("load-stats-watcher",(data)=>{
//     console.log('Refresh load',data)
//   })