import { Box, Flex, Avatar, VStack } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom';

const SearchedProfiles = ({ profile, setIsClicked }) => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate(`/profile/${profile.uid}`);
        setIsClicked(false);
    };
    return (
        <>
            <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} _hover={{ bg: "gainsboro" }} rounded='lg' cursor={"pointer"} onClick={handleProfileClick}>
                <Flex alignItems={"center"} gap={2}>
                    <Avatar src={profile.profilePicUrl} size={"md"} />
                    <VStack gap={0} alignItems={"flex-start"}>
                        <Box fontSize={12} fontWeight={"bold"}>{profile.username}</Box>
                        <Box fontSize={11} color={"gray"}>{profile.name}</Box>
                    </VStack>
                </Flex>
            </Flex>
        </>
    )
}

export default SearchedProfiles;