const { instrument } = require('@socket.io/admin-ui');

const io = require("socket.io")(3000, {
    cors: {
        origin: ["https://admin.socket.io", "http://localhost:8080", "http://localhost:4200"],
    },    
    credentials: true
})

io.on("connection", socket => {
    console.log(socket.id);

    socket.on("send-message", (message, room) => {
        if(room === "") {
            //manda para todos exceto a fonte
            io.broadcast.emit("receive-message", message);
        } else {
            //manda para o usuario da sala
            io.to(room).emit("receive-message", message);
        }                   
    })

    socket.on("join-room", room => {
        socket.join(room);
        if(roomsMap.has(room)) {                                  
            //array of sockets inside that room
            let usersArray = [...io.of("/").adapter.rooms.get(room)];
            roomsMap.set(room, usersArray);
        }
    })

    socket.on('disconnect', () => console.log('disconnected')); 

    //novas partes

    socket.on("fetch-rooms", () => {
        const array = [...roomsMap.keys()];
        io.emit("update-rooms", array);
    })

    socket.on("leave-room", room => {
        if(roomsMap.has(room)) {                  
            let userArray = [...roomsMap.get(room)];
            let userArrayFiltered = userArray.filter( id => id !== socket.id);            
            roomsMap.set(room, userArrayFiltered);
        }
        socket.leave(room);
    });

    socket.on("create-room", room => {
        if(!roomsMap.has(room)) {
            roomsMap.set(room, []);
        }
        const array = [...roomsMap.keys()];
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

var roomsMap = new Map();




