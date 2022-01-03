import React, { useRef } from 'react'
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
    CameraIcon,
    VideoCameraIcon,
    EmojiHappyIcon,
} from '@heroicons/react/solid';
import { useState } from 'react'
import { db, storage } from '../firebase';

// V8 firebase
import firebase from 'firebase/compat/app';

// V9 firebase
// import firebase from 'firebase/app'
// import { setDoc, addDoc, doc, collection, serverTimestamp } from 'firebase/firestore'
function InputBox() {

    const { data: session } = useSession();
    const inputRef = useRef(null);
    const filepickerRef = useRef(null);
    const [imageToPost, setImageToPost] = useState(null);

    const sendPost = async (e) => {
        e.preventDefault();
        if (!inputRef.current.value) return;


        // V8寫法
        db.collection('posts').add({
            message: inputRef.current.value,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(doc => {
            if (imageToPost) {
                const uploadTask = storage.ref(`posts/${doc.id}`).putString(imageToPost, 'data_url')

                removeImage();

                uploadTask.on('state_change', null, error => console.error(error), () => {
                    storage.ref('posts').child(doc.id).getDownloadURL().then(url => {
                        db.collection('posts').doc(doc.id).set({
                            postImage: url
                        }, { merge: true })
                    })
                })
            }
        })

        // V9寫法

        // const collectionDoc = collection(db, 'posts')
        // const theData = {
        //     message: inputRef.current.value,
        //     name: session.user.name,
        //     email: session.user.email,
        //     image: session.user.image,
        //     time: serverTimestamp(),
        //     // timestamp: FieldValue.serverTimestamp(),
        // }
        // try {
        //     await addDoc(collectionDoc, theData)
        // } catch {
        //     console.log('error');
        // } finally {
        //     (doc) => {
        //         if (imageToPost) {
        //             const uploadTask = ref(storage, `posts${file.name}`).putString(imageToPost, 'data_url')
        //             removeImage();
        //             uploadTask.on('state_change')
        //         }
        //     }
        // }
        inputRef.current.value = "";
    };

    const addImagePost = (e) => {

        // 抓到上傳的當案URL
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }

        // 抓到URL之後的動作 要change state
        reader.onload = (readerEvent) => {
            setImageToPost(readerEvent.target.result)
            // console.log(imageToPost);
        }
    }

    const removeImage = () => {
        setImageToPost(null);
    }

    return (
        <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font0medium mt-6">
            <div className="flex space-x-4 p-5  items-center">
                <Image
                    className="rounded-full"
                    src={session.user.image}
                    width="40"
                    height="40"
                    layout="fixed"
                />
                <form className="flex flex-1 ">
                    <input
                        className="rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none"
                        type="text"
                        placeholder={`有什麼想說的, ${session.user.name}`}
                        ref={inputRef} />
                    <button hidden type="submit" onClick={sendPost}>發佈</button>
                </form>
                {imageToPost && (
                    <div onClick={removeImage} className="flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer">
                        <img className="h-10 object-contain" src={imageToPost} />
                        <p className="text-xs text-red-500 text-center">Remove</p>
                    </div>
                )}
            </div>

            <div className="flex justify-evenly p-3 border-t">
                <div className="inputIcon">
                    <VideoCameraIcon className="h-7 text-red-500" />
                    <p className="text-xs sm:text-sm xl:text-base">直播視訊</p>
                </div>
                <div onClick={() => filepickerRef.current.click()} className="inputIcon">
                    <CameraIcon className="h-7 text-green-500" />
                    <p className="text-xs sm:text-sm xl:text-base">照片/影片</p>
                    <input ref={filepickerRef} onChange={addImagePost} type="file" hidden></input>
                </div>
                <div className="inputIcon">
                    <EmojiHappyIcon className="h-7 text-yellow-500" />
                    <p className="text-xs sm:text-sm xl:text-base">感受/活動</p>
                </div>
            </div>

        </div >
    )
}

export default InputBox
