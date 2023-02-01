// const { instrument } = require('@socket.io/admin-ui');
import { instrument } from '@socket.io/admin-ui';

import { Server } from "socket.io";

const io = new Server(3000, {
    cors: {
        origin: ["https://admin.socket.io", "http://localhost:8080", "http://localhost:4200"],
    },    
    // credentials: true
});

// const io = require("socket.io")(3000, {
//     cors: {
//         origin: ["https://admin.socket.io", "http://localhost:8080", "http://localhost:4200"],
//     },    
//     credentials: true
// })

io.on("connection", (socket : any) => {
    console.log(socket.id);

    socket.on("send-message", (message : string, room : string) => {
        if(room === "") {
            //manda para todos exceto a fonte
            io.emit("receive-message", message);
        } else {
            //manda para o usuario da sala
            io.to(room).emit("receive-message", message);
        }                   
    })

    socket.on("join-room", (room : any) => {
        socket.join(room);
        if(roomsMap.has(room)) {                                  
            //set of sockets inside that room
            let usersArray = io.of("/").adapter.rooms.get(room);
            let array = usersArray?.values();       
            if(array) {
                roomsMap.set(room, Array.from(array));
            }             
        }
    })

    socket.on('disconnect', () => console.log('disconnected')); 

    socket.on("fetch-rooms", () => {
        const array = Array.from(roomsMap.keys());
        io.emit("update-rooms", array);
    })

    socket.on("leave-room", (room : string) => {
        socket.leave(room);
        
        if(roomsMap.has(room)) {     
            let userArray = roomsMap.get(room);     
            if(userArray) {                
                let set = io.of("/").adapter.rooms.get(room);     
                let iterable = set?.values();                      
                if(iterable) {
                    let array = Array.from(iterable);                             
                    roomsMap.set(room, Array.from(array));
                } else {
                    roomsMap.set(room, []);
                }               
            }                                         
        }        
    });

    socket.on("create-room", (room : string) => {
        if(!roomsMap.has(room)) {
            roomsMap.set(room, []);
        }
        const array = Array.from(roomsMap.keys());
        io.emit("update-rooms", array);
    })

    setInterval(function () {
        console.log("ROTINA");
        console.log(roomsMap);
    }, 5000);

})

instrument(io, {
    auth: false
});

var roomsMap = new Map<string, string[]>();




