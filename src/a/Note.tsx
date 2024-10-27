import React, { useState, useEffect } from 'react';

const URLBox = () => {
    const [urls, setUrls] = useState([]);
    const [inputUrl, setInputUrl] = useState('');

    // Load URLs from local storage on component mount
    useEffect(() => {
        const storedUrls = JSON.parse(localStorage.getItem('urls')) || [];
        setUrls(storedUrls);
    }, []);

    // Save URLs to local storage whenever the list changes
    useEffect(() => {
        localStorage.setItem('urls', JSON.stringify(urls));
    }, [urls]);

    // Add a new URL
    const addUrl = () => {
        let formattedUrl = inputUrl.trim();

        // Check if the URL starts with http:// or https://
        if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
            formattedUrl = 'https://' + formattedUrl;
        }

        // Add the URL if it's not empty
        if (formattedUrl) {
            setUrls((prevUrls) => [...prevUrls, formattedUrl]);
            setInputUrl(''); // Clear the input field
        }
    };

    // Open a URL in a new tab
    const openUrl = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">URL Storage</h2>
            <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter URL"
                className="border border-gray-300 p-2 rounded mb-4 w-full"
            />
            <button 
                onClick={addUrl}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Add URL
            </button>
            <ul className="mt-4">
                {urls.map((url, index) => (
                    <li key={index} className="flex justify-between items-center p-2 border-b">
                        <span 
                            onClick={() => openUrl(url)} 
                            className="text-blue-500 cursor-pointer hover:underline"
                        >
                            {url}
                        </span>
                        <button 
                            onClick={() => {
                                const updatedUrls = urls.filter((_, i) => i !== index);
                                setUrls(updatedUrls);
                            }}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default URLBox;
