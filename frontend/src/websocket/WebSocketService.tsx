import {useEffect} from "react";

function WebSocketService(props: {
    id: string,
    algorithmTypeId: string,
    isConnected: boolean,
    onDisconnect: () => void,
    incrementMaxStep: () => void,
    items: number[],
    addStep: (item: String) => void
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
            const message = JSON.stringify({id: props.id, algorithmType: props.algorithmTypeId, items: props.items});
            sendMessage(message)
        };

        socket.onmessage = (event) => {
            props.incrementMaxStep()
            props.addStep(event.data)
            console.log("Received message:", event.data);
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
            socket = new WebSocket("ws://localhost:8080/algorithm/sorting"); //todo Later change to dynamic link for the different types
            connect()
        }
    }, [props.isConnected, props.id, props.algorithmTypeId]);

    return null;
}


export default WebSocketService;
