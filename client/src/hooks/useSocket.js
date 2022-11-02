import { useSocketContext } from "../Context/SocketContext";

export default function useSocket() {
  const { socket } = useSocketContext();

  const sendMessage = (message) => {
    socket.emit("command", message);
  };

  return {
    socket,
    sendMessage,
  };
}
