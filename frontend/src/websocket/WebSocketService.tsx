import {useEffect} from "react";

function WebSocketService(props: {
    id: string,
    isConnected: boolean,
    onDisconnect: () => void,
    incrementMaxStep: () => void,
    addStep: (item: string) => void,
    messageToSend: any
}) {
    let socket: WebSocket;

    const sendMessage = (message: string) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
            console.log("Sent message:", message);
        }
    }
    const connect = () => {

        socket.onopen = () => {
            console.log("Connected to WebSocket");
            props.addStep("CLEAR;!")
            const message = JSON.stringify(props.messageToSend);
            sendMessage(message)
        };

        socket.onmessage = (event) => {
            if (event.data) {
                console.log("Received message:", event.data);
                props.incrementMaxStep()
                props.addStep(event.data)
                socket.send(JSON.stringify("ACK"));
            }
        };

        socket.onclose = () => {
            console.log("Disconnected from WebSocket");
            props.onDisconnect();

        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            console.log("Closing WebSocket connection");
            socket.close();
            props.onDisconnect();
        };
    }


    useEffect(() => {
        if (props.isConnected) {
            socket = new WebSocket("ws://localhost:8080/algorithm"); //todo Later change to dynamic link for the different types
            connect()
        }
    }, [props.isConnected, props.id]);

    return null;
}


export default WebSocketService;
