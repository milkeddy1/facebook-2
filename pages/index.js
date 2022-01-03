import { getSession } from 'next-auth/react';
import Head from 'next/head'
import Header from '../components/Header';
import Login from "../components/Login"
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'
import Widgets from '../components/Widgets'
import { db } from '../firebase';

export default function Home({ session, posts }) {
  console.log(session);
  if (!session) return <Login />

  return (
    <div >
      <Head>
        <title>Facebook</title>
      </Head>

      {/* Header */}
      <Header />


      <main className="flex bg-gray-100">
        <Sidebar />
        <Feed posts={posts} />
        <Widgets />
      </main>
    </div>
  )
}


// getServerSideProps的意思是這個頁面會從伺服器渲染
export async function getServerSideProps(context) {
  // get user
  const session = await getSession(context);

  // server side rendering
  const posts = await db.collection('posts').orderBy('timestamp', 'desc').get();

  const docs = posts.docs.map(post => ({
    id: post.id,
    ...post.data(),
    timestamp: null
  }))

  return {
    props: {
      session,
      posts: docs,
    }

  }
}
