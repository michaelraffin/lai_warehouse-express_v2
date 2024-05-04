let io  = require("socket.io-client")
let socket = io.connect("http://192.168.1.148:9091")

let davao = "davao-trucking"
var id = "HG2aC8"
let payload = {reference:id,state:"didAccept"}
socket.on(davao,(data)=>{ 
    console.log(`Welcome to cebu trucking room ${new Date()}`,data)
})

socket.emit("load-watcher",{room:davao,payload},(callback)=>{
    console.log(callback)
})
socket.on(`load-watcher-${id}`,(data)=>{ 
    console.log(`load-watcher`,data)
})


socket.emit("join",{room:davao,payload},(callback)=>{
    console.log(callback)
})
socket.emit("user-watcher",{room:davao})