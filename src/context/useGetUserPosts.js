import { useEffect, useState } from "react"
import usePostStore from "../store/postStore";
import useShowToast from "../components/showToast";
import useUserProfileStore from "../store/useProfileStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

const useGetUserPosts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { posts, setPosts } = usePostStore();
    const showToast = useShowToast();
    const user = useUserProfileStore((state) => state.userProfile);

    useEffect(() => {
        const getPosts = async () => {
            if (!user) { return }
            setIsLoading(true);
            setPosts([])

            try {
                const q = query(collection(db, "posts"), where("createdBy", "==", user.uid));
                const querySnapshot = await getDocs(q);

                const posts = [];
                querySnapshot.forEach(doc => {
                    posts.push({ ...doc.data(), id: doc.id });
                })

                posts.sort((a, b) => b.createdAt - a.createdAt)
                setPosts(posts)
            } catch (error) {
                showToast("Error", error.message, "error");
                setPosts([])
            } finally {
                setIsLoading(false);
            }
        }
        getPosts()
    }, [setPosts, user])
    return { isLoading, posts }
}

export default useGetUserPosts;