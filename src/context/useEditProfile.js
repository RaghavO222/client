import { useState } from "react";
import useShowToast from '../components/showToast';
import { ref, getDownloadURL, uploadString } from 'firebase/storage'
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/useProfileStore";

const useEditProfile = ({ profileData }) => {
    const [isUpdating, setIsUpdating] = useState(null);
    const { setUser } = useAuthStore();
    const { setUserProfile } = useUserProfileStore();

    const showToast = useShowToast();

    const editProfile = async (input, selectedFile) => {
        if (isUpdating || !profileData) {
            return
        }
        setIsUpdating(true);

        const storageRef = ref(storage, `profilePics/${profileData.uid}`);
        const userDocRef = doc(db, "users", profileData.uid);

        let url = "";

        try {
            if (selectedFile) {
                await uploadString(storageRef, selectedFile, "data_url")
                url = await getDownloadURL(ref(storage, `profilePics/${profileData.uid}`))
            }

            const updatedUser = {
                ...profileData,
                name: input.name || profileData.name,
                username: input.username || profileData.username,
                bio: input.bio || profileData.bio,
                profilePicUrl: url || profileData.profilePicUrl
            }

            await updateDoc(userDocRef, updatedUser);
            localStorage.setItem("user-info", JSON.stringify(updatedUser))
            setUser(updatedUser)
            setUserProfile(updatedUser)

        } catch (error) {
            showToast("error", error.message, "error");
        }
    }
    return { editProfile, isUpdating }
}

export default useEditProfile;