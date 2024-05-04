let io  = require("socket.io-client")
let socket = io.connect("http://192.168.1.148:9091")

let davao = "davao-trucking"
socket.on(davao,(data)=>{ 
    console.log(`Welcome to cebu trucking room ${new Date()}`,data)
})


socket.emit("join",{room:davao},(callback)=>{
    console.log(callback)
})
socket.emit("user-watcher",{room:davao})