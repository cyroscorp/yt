import { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../api/firebase";
import CreatePost from "./CreatePost";

// Define the Post interface
interface Author {
  name: string;
}

interface Post {
  id: string;
  title: string;
  postText: string;
  author: Author;
}

function Blog() {
  // Specify the type of postLists as an array of Post
  const [postLists, setPostList] = useState<Post[]>([]);
  const postsCollectionRef = collection(db, "posts");

  // Specify the type of the id parameter
  const deletePost = async (id: string) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    // Remove the deleted post from the state
    setPostList(postLists.filter((post) => post.id !== id));
  };

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      // Map the docs to the Post type
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Post)));
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
              className="post bg-black shadow-md rounded-lg p-6 mb-6"
            >
              <div className="postHeader flex justify-between items-center">
                <div className="title">
                  <h1 className="text-2xl font-bold text-white">
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
              <div className="postTextContainer mt-4 text-white">
                {post.postText}
              </div>
              <h3 className="mt-4 text-sm text-white">@{post.author.name}</h3>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Blog;
