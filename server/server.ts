// const { instrument } = require('@socket.io/admin-ui');
import { instrument } from '@socket.io/admin-ui';
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    socket.on("join-room", async (room : string) => {
        socket.join(room);

        const existingRoom = await prisma.room.findUnique({
            where: {
                name: room
            }
        });

        if(existingRoom) {

            const existingUser = await prisma.user.findUnique({
                where: {
                    socket: socket.id.toString()
                }
            });

            if(existingUser) {
                await prisma.user.update({
                    where: {
                        socket: socket.id.toString()                                        
                    },
                    data: {
                        roomId: existingRoom.id
                    }
                })
            }            
        }        

        getRooms();
    })

    socket.on('disconnect', async () => {

        const user = await prisma.user.findUnique({
            where: {
                socket: socket.id.toString()
            }
        })

        if(user) {                     
            await prisma.user.delete({
                where: {
                    socket: socket.id.toString()
                }
            })
        }       

        
    }); 

    socket.on("fetch-rooms", async () => {
        getRooms();
    })

    socket.on("leave-room", async (room : string) => {

        socket.leave(room);

        const existingRoom = await prisma.room.findUnique({
            where: {
                name: room
            }
        });

        if(existingRoom) {

            const existingUser = await prisma.user.findUnique({
                where: {
                    socket: socket.id.toString()
                }
            });

            if(existingUser) {
                await prisma.user.update({
                    where: {
                        socket: socket.id.toString()                                        
                    },
                    data: {
                        roomId: null
                    }
                })
            }            
        }                
    });

    socket.on("create-room", async (room : string) => {     

        const existingRoom = await prisma.room.findUnique({
            where: {
                name: room
            }
        });

        if(!existingRoom) {
            await prisma.room.create({
                data: {
                    name: room
                }
            })
        }

        getRooms();
    })

    socket.on("create-user", async (userName : string) => {     

        const existingUser = await prisma.user.findUnique({
            where: {
                socket: userName
            }
        });

        if(!existingUser) {
            await prisma.user.create({
                data: {
                    socket: socket.id.toString(),
                    userName: userName,
                    roomId: null
                }
            })
        }        
    })
    
    socket.on("delete-room", async (room : string) => { 
        const existingRoom = await prisma.room.findUnique({
            where: {
                name: room
            }
        });

        if(existingRoom) {
            await prisma.room.delete({
                where: {
                    name: room
                }
            })
        }

        getRooms();
    })


    // setInterval(async function () {
    //     console.log("ROOMS");
    //     const rooms = await prisma.room.findMany();
    //     if(rooms) {
    //         console.log(rooms);
    //     }

    //     console.log("USERS");
    //     const users = await prisma.user.findMany();
    //     if(users) {
    //         console.log(users);
    //     }

    // }, 5000);

})

instrument(io, {
    auth: false
});

var roomsMap = new Map<string, string[]>();

async function getRooms() {   
    const rooms = await prisma.room.findMany({
        include: {
            users: true
        }
    });

    if(rooms) {
        io.emit("update-rooms", rooms);
    }       
}






