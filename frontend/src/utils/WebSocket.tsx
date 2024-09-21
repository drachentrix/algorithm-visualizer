import useWebSocket, {ReadyState} from "react-use-websocket";

export const WebSocket = () => {
    const url = import.meta.env.VITE_WEBSOCKET_KEY
    const {readyState, sendMessage, lastMessage} = useWebSocket(url)

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
}