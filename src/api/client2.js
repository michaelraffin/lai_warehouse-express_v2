let io  = require("socket.io-client")
let socket = io.connect("http://192.168.1.148:9091")

let cebu = "davao-trucking"
socket.on(cebu,(data)=>{ 
    console.log(`Welcome to cebu trucking room ${new Date()}`,data)
})

socket.emit("join",{room:cebu},(callback)=>{
        console.log(callback)
})
socket.emit("user-watcher",{room:cebu})