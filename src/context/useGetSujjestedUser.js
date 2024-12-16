import { useEffect, useState } from "react";
import useShowToast from "../components/showToast";
import useAuthStore from "../store/authStore";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase"

const useGetSuggestedUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedUser, setSuggestedUser] = useState([]);
    const user = useAuthStore((state) => state.user);
    const showToast = useShowToast();

    useEffect(() => {
        const getSuggestedUser = async () => {
            setIsLoading(true);
            try {
                const userRef = collection(db, "users");
                const q = query(userRef, where("uid", "not-in", [user.uid, ...user.following]), orderBy("uid"), limit(3))
                const querySnapshot = await getDocs(q);
                const users = [];
                querySnapshot.forEach((doc) => {
                    users.push({ ...doc.data(), id: doc.id });
                })

                setSuggestedUser(users);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsLoading(false);
            }
        }

        if (user) {
            getSuggestedUser();
        }
    }, [user]);

    return { isLoading, suggestedUser };
}

export default useGetSuggestedUser;