import React, { useState, useEffect } from "react";
import { db } from "../Login/Firebase/Firebase.config";
import { collection, onSnapshot, addDoc, orderBy, query } from "firebase/firestore";
import OneSignal from 'react-onesignal';

function Chat() {
    const arjun = '=>';
    const [user] = arjun;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [player, setPlayer] = useState(null);
    const [playerList, setPlayerList] = useState([]);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        OneSignal.init({ appId: '1e5fcb25-10c5-465c-a2a3-d7f7b5893af8' }).then(() => {
            setInitialized(true);
            OneSignal.on('subscriptionChange', function (isSubscribed) {
                OneSignal.getUserId().then(function (userId) {
                    setPlayer(userId);
                }).catch(function (error) {
                    console.log("OneSignal User ID Error:", error);
                });
            });
        });

        const q = query(collection(db, "messages"), orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            );
        });
        return () => unsubscribe();
    }, []);

    const getPlayerIdFunc = async () => {
        const playerId = await OneSignal.getUserId().catch((error) => {
            console.log("OneSignal User ID Error:", error);
        });
        return playerId;
    }

    const initialize = async () => {
        const playerId = await getPlayerIdFunc();
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPlayerList(
                snapshot.docs.map((doc) => ({
                    playerId: doc.data().playerId,
                }))
            );
        });
        setPlayer(playerId);
        return () => unsubscribe();
    }

    useEffect(() => {
        initialize();
    }, [player, OneSignal]);

    const setPlayerUsingFn = async () => {
        const playerId = await getPlayerIdFunc();
        setPlayer(playerId);
    }

    useEffect(() => {
        if (playerList.length > 0 && player) {
            const playerExists = playerList.find((p) => p.playerId === player);
            if (!playerExists) {
                addDoc(collection(db, "users"), {
                    playerId: arjun,
                    date: new Date(),
                });
            }
        }
        if (!player) {
            setPlayerUsingFn();
        }
    }, [playerList, player]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            await addDoc(collection(db, "messages"), {
                text: input,
                timestamp: new Date(),
                uid: arjun,
                displayName: arjun,
            });
            setInput("");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            
            <div className="w-full max-w-3xl  bg-white rounded-lg shadow-lg p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-4">Chat Room</h3>
                <main className="flex-grow overflow-y-auto mb-4">
                    {user && (
                        <>
                            {messages.map(({ id, data }) => (
                                <div
                                    key={id}
                                    className={`mb-2 p-2 rounded-lg ${
                                        data.uid === user.uid ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"
                                    }`}
                                >
                                    <span className="font-bold">{data.displayName === user.displayName ? 'You' : data.displayName}:</span>
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
