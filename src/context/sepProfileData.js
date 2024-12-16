import { useEffect, useState } from "react";
import useShowToast from "../components/showToast";
import { query, where, collection, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase';

const useSepProfileData = ({ uid }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [userProfile, setUserProfile] = useState(null);

	const showToast = useShowToast();

	useEffect(() => {

		const getUserProfile = async () => {
			if (uid) {
				setIsLoading(true);
				setUserProfile(null);
				try {
					const usersCollection = collection(db, "users");
					const q = query(usersCollection, where("uid", "==", uid));
					const querySnapshot = await getDocs(q);

					if (!querySnapshot.empty) {
						const userDoc = querySnapshot.docs[0];
						setUserProfile(userDoc.data());
						console.log(userDoc.data());
					} else {
						console.log("User not found");
					}
				} catch (error) {
					showToast("Error", error.message, "error");
				} finally {
					setIsLoading(false);
				}
			} else {
				console.log("UID is not provided");
				setIsLoading(false);
				return;
			}

		};

		getUserProfile();

	}, [uid]);

	return { isLoading, userProfile, setUserProfile };
};

export default useSepProfileData;
