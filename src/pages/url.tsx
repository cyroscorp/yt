import React, { useState, useEffect, useRef } from "react";
import { db } from "../api/firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";

// Define the URL interface for the structure of each URL
interface UrlEntry {
    id: string;
    data: {
        url: string;
        timestamp: Date;
    };
}

const UrlStorageBox: React.FC = () => {
    const [urls, setUrls] = useState<UrlEntry[]>([]);
    const [input, setInput] = useState<string>("");

    const urlEndRef = useRef<HTMLDivElement | null>(null);

    // Initialize Firestore subscriptions
    useEffect(() => {
        const q = query(collection(db, "urls"), orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUrls(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: {
                        url: doc.data().url,
                        timestamp: doc.data().timestamp.toDate(), // Convert to Date
                    }
                }))
            );
        });
        return () => unsubscribe();
    }, []);

    // Auto-scroll to the bottom when a new URL is added
    useEffect(() => {
        if (urlEndRef.current) {
            urlEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [urls]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // Add a URL to the Firestore
    const addUrl = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            // Prepend "https://" if it's not already present
            const formattedUrl = input.startsWith("http://") || input.startsWith("https://")
                ? input
                : `https://${input}`;

            await addDoc(collection(db, "urls"), {
                url: formattedUrl,
                timestamp: new Date(),
            });
            setInput("");
        }
    };

    // Delete a URL from Firestore
    const deleteUrl = async (id: string) => {
        const urlDoc = doc(db, "urls", id);
        await deleteDoc(urlDoc);
        // Remove the deleted URL from the state
        setUrls(urls.filter((url) => url.id !== id));
    };

    return (
       
            <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-4 flex flex-col transition-all"
                 style={{ maxHeight: urls.length > 0 ? "70vh" : "200px", overflowY: "auto" }}>
                <h3 className="text-xl font-semibold mb-4">Most important/useful Website (add as per your choice)</h3>
                <form onSubmit={addUrl} className="flex items-center mb-4">
                    <input
                        value={input}
                        onChange={handleInputChange}
                        type="text"
                        className="flex-grow rounded-l-lg p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a new URL..."
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
                    >
                        Add
                    </button>
                </form>
                <main className="flex-grow overflow-y-auto">
                    <>
                        {urls.map(({ id, data }) => (
                            <div key={id} className="mb-2 p-2 rounded-lg bg-gray-200 flex justify-between items-center">
                                <a
                                    href={data.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {data.url}
                                </a>
                                <button
                                    onClick={() => deleteUrl(id)}
                                    className="ml-4 text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                        <div ref={urlEndRef} />
                    </>
                </main>
            </div>
     
    );
};

export default UrlStorageBox;
