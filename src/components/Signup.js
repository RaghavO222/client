import React, { useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Box, VStack, Image, Input, Button, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useShowToast from './showToast';

const Signup = ({ onSwitchToLogin }) => {
  const showToast = useShowToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !username || !name) {
      showToast("Error", "Please fill all fields", "error");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userDoc = {
        uid: userCredential.user.uid,
        email: email,
        username: username,
        name: name,
        bio: "",
        profilePicUrl: "",
        followers: [],
        following: [],
        posts: [],
        createdAt: Date.now()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
      localStorage.setItem("user-info", JSON.stringify(userDoc));
      console.log('Signup successful');
      navigate('/');
      window.location.reload();
    } catch (error) {
      showToast("Error", error.message, "error");
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
          <form onSubmit={handleSignup}>
            <VStack spacing={4}>
              <Image m={8} src="/unai2.PNG" alt='logo' h={51} w={175} cursor={'pointer'} />
              <Input
                type="email"
                placeholder="Email"
                fontSize={15}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Name"
                fontSize={15}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Username"
                fontSize={15}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                fontSize={15}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button w={"full"} colorScheme='blue' size={"sm"} fontSize={15} type="submit">Signup</Button>
            </VStack>
          </form>
        </Box>

        <Box
          border={"1px solid gray"}
          borderRadius={4}
          padding={5}
          width={{ base: "90%", md: "370px" }} // Adjusting width for different screen sizes
        >
          <Flex justifyContent={"center"} alignItems={"center"}>
            <Text>Already Have an account?  </Text>
            <Text cursor="pointer" color="blue.500" onClick={onSwitchToLogin}>Log IN</Text>
          </Flex>
        </Box>
      </VStack>
    </>
  );
};

export default Signup;
