const express = require('express');
const socket = require('socket.io');

let port = 5000;

const app = express(); //Initialize and start server
app.use(express.static("public"));

let server = app.listen(port,()=>{

    console.log("Server started");
})

let io = socket(server);

io.on("connection",(socket)=>{

    console.log("Connection made successfully");

    //Received data
    socket.on("beginPath",(data)=>{

        //Transfer data to other computers
        io.sockets.emit("beginPath",data);
    })

    socket.on("drawStroke",(data)=>{

        io.sockets.emit("drawStroke",data);
    })

    socket.on("redoUndo",(data)=>{

        io.sockets.emit("redoUndo",data);
    })
})

