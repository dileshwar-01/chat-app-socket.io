import { AuthContext } from "./AuthContext";

const { createContext, useState, useContext, useEffect } = require("react");


export const ChatContext = createContext();

export const ChatProvider =  ({children})=>{
    const [messages,setMessages] = useState([]);
    const [users,setUsers] = useState([]);
    const [selectedUser,setSelectedUser] = useState(null);
    const [unseenMessages,setUnseenMessages]  = useState({});//key value pairs of userIds with unseenMessage counts

    const {socket,axios} = useContext(AuthContext);

    //function to get users from the sidebar
    const getUsers= async()=>{
        try {
            const {data} = await axios.get('/api/messages/users');
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    
    //function to get messages of the selected user
    const getMessages = async(userId)=>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to send messages
    const sendMessage= async(messageData)=>{
        try {
            const{data} = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);
            if(data.success){
                setMessages((prev)=>[...prev,data.newMessage]);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to subscribe to messages for the selected user
    const subscribeToMessages = async()=>{
        if(!socket) return;
        socket.on('newMessage',(newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){ //chat opened
                newMessage.seen =true;
                setMessages((prev)=>[...prev, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);

            }else{
                setUnseenMessages((prev)=>({
                    ...prev, [newMessage.senderId] : prev[newMessage.senderId] ? prev[newMessage.senderId]+1 : 1
                }))
            }
        })
    }
    //function to unsubscribe from messages
    const unsubscribeFromMessages =async()=>{
        if(socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=>unsubscribeFromMessages();
    },[socket,selectedUser]);

    const value={
        messages,users,selectedUser,getUsers,setMessages,sendMessage,
        setSelectedUser,unseenMessages,setUnseenMessages
    }

    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}