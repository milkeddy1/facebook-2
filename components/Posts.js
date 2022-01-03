import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../firebase'
import Post from '../components/Post'



function Posts({ posts }) {

    const [realtimePosts] = useCollection(
        db.collection('posts').orderBy('timestamp', 'desc'))


    return (
        <div>
            {/* 這邊要加問號是因為realtimePosts不是一開始就在，他會先load所以不用問號會是undefined */}
            {
                realtimePosts ?
                    realtimePosts?.docs.map(post => (
                        <Post
                            key={post.id}
                            name={post.data().name}
                            message={post.data().message}
                            email={post.data().email}
                            timestamp={post.data().timestamp}
                            image={post.data().image}
                            postImage={post.data().postImage}
                        />
                    )) :
                    (
                        posts.map((post) => (
                            <Post
                                key={post.id}
                                name={post.name}
                                message={post.message}
                                email={post.email}
                                timestamp={post.timestamp}
                                image={post.image}
                                postImage={post.postImage}
                            />
                        ))
                    )
            }


        </div>
    )
}

export default Posts
