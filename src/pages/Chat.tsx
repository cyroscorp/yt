import React, { useState, useEffect } from "react";
import { db } from "../api/firebase";
import { collection, onSnapshot, addDoc, orderBy, query } from "firebase/firestore";


// Define the Message interface for the structure of each message
interface Message {
    id: string;
    data: {
        text: string;
        uid: string;
        displayName: string;
        timestamp: Date;
    };
}

// Define the Player interface for player structure
interface Player {
    playerId: string;
}

const Chat: React.FC = () => {
    // Mock user object for testing
    const user = { uid: 'some-uid', displayName: 'Arjun' };
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [player] = useState<string | null>(null);
    const [playerList, setPlayerList] = useState<Player[]>([]);
  

    // Initialize OneSignal and Firestore subscriptions
    useEffect(() => {
        
       
        
        const q = query(collection(db, "messages"), orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: {
                        text: doc.data().text,
                        uid: doc.data().uid,
                        displayName: doc.data().displayName,
                        timestamp: doc.data().timestamp.toDate(), // Convert to Date
                    }
                }))
            );
        });
        return () => unsubscribe();
    }, []);

    // Get player ID
   

    // Initialize the player and fetch users from Firestore
    const initialize = async () => {
       
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPlayerList(
                snapshot.docs.map((doc) => ({
                    playerId: doc.data().playerId,
                }))
            );
        });
        
        return () => unsubscribe();
    }

    useEffect(() => {
        initialize();
    }, []);

    // Check if the player is in the list, and if not, add them to the database
    useEffect(() => {
        if (playerList.length > 0 && player) {
            const playerExists = playerList.find((p) => p.playerId === player);
            if (!playerExists) {
                addDoc(collection(db, "users"), {
                    playerId: user.uid,
                    date: new Date(),
                });
            }
        }
        
    }, [playerList, player]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // Send a message to the Firestore
    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            await addDoc(collection(db, "messages"), {
                text: input,
                timestamp: new Date(),
                uid: user.uid,
                displayName: user.displayName,
            });
            setInput("");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-4">Chat Room</h3>
                <main className="flex-grow overflow-y-auto mb-4">
                    {user && (
                        <>
                            {messages.map(({ id, data }) => (
                                <div
                                    key={id}
                                    className={`mb-2 p-2 rounded-lg ${data.uid === user.uid ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"}`}
                                >
                                    <span className="font-bold">{data.displayName === user.displayName ? 'Anonymous' : data.displayName}:</span>
                                    <span className="ml-2">{data.text}</span>
                                </div>
                            ))}
                        </>
                    )}
                </main>
                {user && (
                    <footer className="mt-4">
                        <form onSubmit={sendMessage} className="flex items-center">
                            <input
                                value={input}
                                onChange={handleInputChange}
                                type="text"
                                className="flex-grow rounded-l-lg p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Type your message..."
                                required
                            />
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors">
                                Send
                            </button>
                        </form>
                    </footer>
                )}
            </div>
        </div>
    );
}

export default Chat;
