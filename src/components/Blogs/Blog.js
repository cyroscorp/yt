import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Login/Firebase/Firebase.config";
import CreatePost from "./CreatePost";

function Blog() {
  const [postLists, setPostList] = useState([]);
  const postsCollectionRef = collection(db, "posts");

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    // Remove the deleted post from the state
    setPostList(postLists.filter((post) => post.id !== id));
  };

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
  }, []);

  return (
    <>
      <CreatePost />
      <div className="homePage container mx-auto p-6">
        {postLists.length === 0 ? (
          <p className="text-center text-gray-500">No posts available</p>
        ) : (
          postLists.map((post) => (
            <div
              key={post.id}
              className="post bg-white shadow-md rounded-lg p-6 mb-6"
            >
              <div className="postHeader flex justify-between items-center">
                <div className="title">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {post.title}
                  </h1>
                </div>
                <div className="deletePost text-red-500 hover:text-red-600 cursor-pointer">
                  <button
                    onClick={() => deletePost(post.id)}
                    className="focus:outline-none"
                    aria-label="Delete post"
                  >
                    &#128465;
                  </button>
                </div>
              </div>
              <div className="postTextContainer mt-4 text-gray-600">
                {post.postText}
              </div>
              <h3 className="mt-4 text-sm text-gray-400">@{post.author.name}</h3>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Blog;
