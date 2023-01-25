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

    socket.on("join-room", (room, callback) => {
        //cada usuario pode estar em varios rooms ao mesmo tempo !
        //após dar join na room, o servidor manda um callback para o client contendo a mensagem de sucesso
        socket.join(room);
        callback(`Joined ${room}`);
    })

    socket.on('disconnect', () => console.log('disconnected')); 

    //novas partes

    socket.on("fetch-rooms", () => {
        const roomsMap = io.of("/").adapter.rooms;
        var roomsMapCopy = new Map(roomsMap)

        for (const roomId of roomsMap.keys()) {
            const set = roomsMap.get(roomId);
            if(set.size == 1 && set.has(roomId)) {
                roomsMapCopy.delete(roomId);
            }
        }

        const array = [...roomsMapCopy.keys()];
        console.log(array);
        io.emit("update-rooms", array);
    })

    socket.on("create-and-join-room", room => {
        socket.join(room);       

        //pega os rooms que este socket está presente
        // const array = [...socket.rooms];
        // array.shift(); //removes first item, which is the default room connected
        // console.log(array);        

        const roomsMap = io.of("/").adapter.rooms;
        var roomsMapCopy = new Map(roomsMap)

        for (const roomId of roomsMap.keys()) {
            const set = roomsMap.get(roomId);
            if(set.size == 1 && set.has(roomId)) {
                roomsMapCopy.delete(roomId);
            }
        }

        const array = [...roomsMapCopy.keys()];
        console.log(array);
        io.emit("update-rooms", array);

    })

    socket.on("leave-room", room => {
        socket.leave(room);
    });

    socket.on("create-room", room => {
        if( !(room in roomsArray) ) {
            roomsArray.push(room);
        }
    })

    // setInterval(function () {
    //     console.log("ROTINA");
    //     console.log(roomsArray);
    // }, 5000);

})

instrument(io, {
    auth: false
});

const roomsArray = [];



