import React from 'react';
import { Container, Flex, Box } from '@chakra-ui/react';
import FeedPost from '../components/Feed/FeedPost';
import SuggestedUser from '../components/Suggested User/SuggestedUser';

const HomePage = ({ isClicked, setIsClicked }) => {
  console.log(isClicked)
  return (
    <Container maxW={"container.lg"}>
      <Flex gap={!isClicked && 0}>
        <Box flex={2} py={10} ><FeedPost /></Box>
        {isClicked ? (
          <Box flex={3} mr={20} maxW={300} py={10} display={{ base: "none", lg: "none", xl: "block" }}><SuggestedUser /></Box>
        ) : (
          <Box flex={3} mr={20} maxW={300} py={10} display={{ base: "none", lg: "block" }}><SuggestedUser /></Box>
        )}

      </Flex>
    </Container>
  );
};

export default HomePage;

