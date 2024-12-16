import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Box, VStack, Image, Input, Button, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = ({ onSwitchToSignup }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginUser = useAuthStore((state) => state.setUser)

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const db = getFirestore();

    try {
      const q = query(collection(db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const email = userDoc.data().email;

        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const userStat = {
          uid: userCredential.user.uid,
          email: userData.email,
          username: userData.username,
          name: userData.name,
          bio: userData.bio || '',
          profilePicUrl: userData.profilePicUrl || '',
          followers: userData.followers || [],
          following: userData.following || [],
          posts: userData.posts || [],
          createdAt: userData.createdAt || new Date().toISOString(),
        };
        localStorage.setItem('user-info', JSON.stringify(userStat));
        loginUser(userStat)
        navigate('/');
      } else {
        console.error('Username not found');
      }
    } catch (error) {
      console.error('Login error', error);
    }
  };

  return (
    <>
      <VStack spacing={2}>
        <Box
          border={"1px solid gray"}
          borderRadius={4}
          padding={5}
          width={{ base: "90%", md: "370px" }}
        >
          <form onSubmit={handleLogin}>
            <VStack spacing={4}>
              <Image m={8} src="/unai2.PNG" alt='logo' h={51} w={175} cursor={'pointer'} />
              <Input
                type="text"
                placeholder="Username"
                fontSize={15}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                fontSize={15}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button w={"full"} colorScheme='blue' size={"sm"} fontSize={15} type="submit">Login</Button>

              <Flex alignItems={"center"} justifyContent={"center"} my={4} gap={1} w={"full"}>
                <Box flex={2} h={"1px"} bg={"gray.400"} />
                <Text mx={1} fontSize={12} color={"gray.600"}>OR</Text>
                <Box flex={2} h={"1px"} bg={"gray.400"} />
              </Flex>

              <Text fontSize={12}>Forgotten your password?</Text>
            </VStack>
          </form>
        </Box>

        <Box
          border={"1px solid gray"}
          borderRadius={4}
          padding={5}
          width={{ base: "90%", md: "370px" }}
        >
          <Flex justifyContent={"center"} alignItems={"center"}>
            <Text>Don't Have an account?  </Text>
            <Text cursor="pointer" color="blue.500" onClick={onSwitchToSignup}>Sign Up</Text>
          </Flex>
        </Box>
      </VStack>
    </>
  );
};

export default Login;
