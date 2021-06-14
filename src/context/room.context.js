/* eslint-disable arrow-body-style */
import React, { createContext, useState, useEffect, useContext } from "react";
import { database } from "../misc/firebase";
import { transformToArray } from "../misc/helpers";


const RoomContext = createContext();

export const RoomProvier =  ({children}) => {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const roomListRef = database.ref('room');

    roomListRef.on('value', (snap) => {
      const data = transformToArray(snap.val());
      setRoom(data);

    })

    return () => {
      roomListRef.off();
    }
    
  }, [])

  return <RoomContext.Provider value={room}>{children}</RoomContext.Provider>
}

export const useRoom = () => useContext(RoomContext);