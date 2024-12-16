import { useState } from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { Box, Container, Flex, Image } from '@chakra-ui/react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"} px={4}>
      <Container maxW={"full"} padding={0}>
        <Flex justifyContent={"center"} alignItems={"center"} gap={20}>
          <Box display={{ base: "none", md: "block" }}>
            <Image src="/auth.PNG" h={650} alt='Photo img' />
          </Box>

          <Box>
            {isLogin ? (
              <Login onSwitchToSignup={() => setIsLogin(false)} />
            ) : (

              <Signup onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
};

export default AuthPage;
