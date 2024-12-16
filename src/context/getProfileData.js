import { db } from '../firebase/firebase';
import { query, where, collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import useUserProfileStore from '../store/useProfileStore';

const useProfileData = ({ uid }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userProfile, setUserProfile } = useUserProfileStore()

  useEffect(() => {
    const fetchProfileData = async () => {
      if (uid) {
        try {
          const usersCollection = collection(db, "users");
          const q = query(usersCollection, where("uid", "==", uid));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) { return setUserProfile(null); }

          let userDoc;
          querySnapshot.forEach((doc) => {
            userDoc = doc.data();
          })

          setUserProfile(userDoc);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError(error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [setUserProfile, uid]);

  return { userProfile, loading, error };
};

export default useProfileData;
