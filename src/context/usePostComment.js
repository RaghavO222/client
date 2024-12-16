import useShowToast from "../components/showToast"
import { useState } from "react"
import useAuthStore from "../store/authStore"
import usePostStore from "../store/postStore"
import { db } from "../firebase/firebase";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";

const usePostComment = () => {
    const [isCommenting, setIsCommenting] = useState(false);
    const showToast = useShowToast();
    const user = useAuthStore(state => state.user);
    const addComment = usePostStore(state => state.addComment);

    const handlePostComment = async (postId, comment) => {
        if (isCommenting) return;
        setIsCommenting(true);
        const newCom = {
            comments: comment,
            createdAt: Date.now(),
            createdBy: user.uid,
            postId
        }
        try {
            await updateDoc(doc(db, "posts", postId), {
                comment: arrayUnion(newCom)
            })
            addComment(postId, newCom)
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsCommenting(false);
        }
    }
    return { isCommenting, handlePostComment };
}

export default usePostComment;
