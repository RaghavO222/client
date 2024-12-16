import { Avatar, Box, Flex, VStack, Text } from "@chakra-ui/react";
import useFollower from "../../context/useFollowUser";
import { Link } from "react-router-dom";


const SUser = ({ avatar, name, followers, uid }) => {

  const { isFollowing, isUpdatingFollow, handleFollowUser } = useFollower(uid);


  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} >
      <Flex alignItems={"center"} gap={2}>
        <Link to={`/profile/${uid}`}>
          <Avatar src={avatar} name={name} size={"md"} />
        </Link>
        <VStack gap={0} alignItems={"flex-start"}>
          <Link to={`/profile/${uid}`}>
            <Box fontSize={12} fontWeight={"bold"}>{name}</Box>
          </Link>
          <Box fontSize={11} color={"gray"}>{followers} followers</Box>
        </VStack>
      </Flex>
      <Text
        fontSize={12}
        bg={"transparent"}
        _hover={{ bg: "transparent" }}
        h={"max-content"}
        fontWeight={"medium"}
        color={"blue"}
        cursor={"pointer"}
        onClick={handleFollowUser}
        isLoading={isUpdatingFollow}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Text>
    </Flex>
  )
};

export default SUser;