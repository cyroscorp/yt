import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../api/firebase';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [postText, setPostText] = useState('');

  const postsCollectionRef = collection(db, 'posts');
 

  const createPost = async () => {
    await addDoc(postsCollectionRef, {
      title: title,
      postText: postText,
      author: { name: 'Anonymous', id: '1' }
    }
  );
    // Clear input fields after submitting
    setTitle('');
    setPostText('');
    window.location.reload();
  };

  return (
    <div className="createPostPage container mx-auto p-6 bg-black rounded-lg shadow-md">
      <div className="cpContainer max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-center text-white">Post your thoughts</h1>
        <div className="inputGp mb-4">
          <label className="block text-white text-sm font-bold mb-2">Title:</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Title..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="inputGp mb-4">
          <label className="block text-white text-sm font-bold mb-2">Post:</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-32 resize-none"
            placeholder="Post..."
            value={postText}
            onChange={(event) => setPostText(event.target.value)}
          />
        </div>
        <button
          onClick={createPost}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
        >
          Submit Post
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
