import {useEffect} from "react";
import {CompatClient, Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';


function WebSocketService(){
    var socket: WebSocket;
    var stomp: CompatClient;

    useEffect( () => {
            socket = new SockJS("http://localhost:8080");
            connect()
            return () => {disconnect()}
        }
    )

     const connect = () => {
        stomp = Stomp.over(socket)
        stomp?.connect({}, () => {
            stomp?.subscribe('algorithm/receive', () => {})

            stomp.subscribe('algorithm/reply', (message) => {
                console.log(message)
            })
        })
    }

    const disconnect = () => {
        stomp.disconnect()
    }
}


export default WebSocketService