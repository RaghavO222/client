import { collection, getDocs, query, where } from "firebase/firestore";
import useShowToast from "../components/showToast";
import { db } from "../firebase/firebase";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/useProfileStore";
import { useState, useEffect } from 'react';
import usePostStore from '../store/postStore'

const useGetFeedPost = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { posts, setPosts } = usePostStore();
    const user = useAuthStore((state) => state.user);
    const showToast = useShowToast();
    const { setUserProfile } = useUserProfileStore();
    useEffect(() => {
        const getFeedPosts = async () => {
            setIsLoading(true)
            if (user.following.length === 0) {
                setIsLoading(false);
                setPosts([]);
                return
            }
            const q = query(collection(db, "posts"), where("createdBy", "in", user.following))
            try {
                const querrySnapshot = await getDocs(q)
                const feedPosts = [];

                querrySnapshot.forEach(doc => {
                    feedPosts.push({ id: doc.id, ...doc.data() })
                })

                feedPosts.sort((a, b) => b.createdAt - a.createdAt)
                setPosts(feedPosts)
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsLoading(false);
            }
        }

        if (user) {
            getFeedPosts();
        }
    }, [user, setPosts, setUserProfile])

    return { isLoading, posts }
}

export default useGetFeedPost;