import { LoadingContextProvider } from "./LoadingContext";
import { SocketContextProvider } from "./SocketContext";

export default function ContextWrapper({ children }) {
  return (
    <LoadingContextProvider>
      <SocketContextProvider>{children}</SocketContextProvider>
    </LoadingContextProvider>
  );
}
