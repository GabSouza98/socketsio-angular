export interface Room {
    id: BigInt,
    name: string,
    users: User[]
}

export interface User {
    id: BigInt,
    roomId: BigInt,
    createdAt: Date,
    socket: String,
    userName?: String    
}
