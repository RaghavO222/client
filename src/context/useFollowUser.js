import { useEffect, useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import useShowToast from "../components/showToast";
import useAuthStore from "../store/authStore";
import useUserProfileStore from '../store/useProfileStore';

const useFollower = (userId) => {
    const [isUpdatingFollow, setIsUpdating] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const user = useAuthStore((state) => state.user);
    const { setUser } = useAuthStore();
    const { userProfile, setUserProfile } = useUserProfileStore()
    const showToast = useShowToast();

    const handleFollowUser = async () => {
        setIsUpdating(true);
        try {
            const currentUserRef = doc(db, "users", user.uid);
            const userToFollowRef = doc(db, "users", userId);

            await updateDoc(currentUserRef, {
                following: isFollowing ? arrayRemove(userId) : arrayUnion(userId),
            });
            await updateDoc(userToFollowRef, {
                followers: isFollowing ? arrayRemove(user.uid) : arrayUnion(user.uid),
            });

            if (isFollowing) {
                setUser({
                    ...user,
                    following: user.following.filter((uid) => uid !== userId),
                });
                if (userProfile) {
                    setUserProfile({
                        ...userProfile,
                        followers: userProfile.followers.filter((uid) => uid !== user.uid),
                    });
                    console.log("unfollowed");
                }
                localStorage.setItem(
                    "user-info",
                    JSON.stringify({
                        ...user,
                        following: user.following.filter((uid) => uid !== userId),
                    })
                );
                setIsFollowing(false);

            } else {
                setUser({
                    ...user,
                    following: [...user.following, userId],
                });
                if (userProfile) {
                    setUserProfile({
                        ...userProfile,
                        followers: [...userProfile.followers, user.uid],
                    });
                    console.log("followed");
                }
                localStorage.setItem(
                    "user-info",
                    JSON.stringify({
                        ...user,
                        following: [...user.following, userId],
                    })
                );
                setIsFollowing(true);

            }
        } catch (error) {
            showToast("error", error.message, "error");
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        if (user && user.following) {
            const isFollowing = user.following.includes(userId);
            setIsFollowing(isFollowing);
        }
    }, [user, userId]);

    return { isUpdatingFollow, isFollowing, handleFollowUser };
};

export default useFollower;


