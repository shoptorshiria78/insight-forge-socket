const io = require("socket.io")(8900, {
   cors: {
      origin: "https://insight-forge-psi.vercel.app",
      // origin: "http://localhost:3000",
      methods: ["GET", "POST"]
   }
})

let users = [];

// add user
const addUser = (userId, socketId) => {
   !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
}
// remove user
const removeUser = (socketId) => {
   users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (receiverId) => {

   console.log("console log from get user", users)
   return users.find((user) => user.userId === receiverId)
}


io.on("connection", (socket) => {
   // when connect
   console.log("a user connected")

   // take userId and socketId
   socket.on("addUser", userId => {
      // console.log(userId)
      let users = [];
      addUser(userId, socket.id)
      console.log("from add user", users)
      io.emit("getUsers", users)
      console.log("at the top of send msg", users)
   })

   // send and get message
   socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      addUser(receiverId, socket.id)
      io.emit("getUsers", users)
      console.log("before send msg", users)
      const user = getUser(receiverId)
      console.log("after send msg", user.socketId)
      io.to(user.socketId).emit("getMessage", {
         senderId,
         text
      })
   })


   // when disconnect

   socket.on("disconnect", () => {
      console.log("user disconnected")
      removeUser(socket.id);
      io.emit("getUsers", users)
   })
});