import { VStack, Flex, Text, Link, Avatar, Container } from "@chakra-ui/react";
import SUser from './SUser';
import { Link as RouterLink } from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import useGetSuggestedUser from "../../context/useGetSujjestedUser";
import { useAuth } from "../../context/AuthContext"

const SuggestedUser = () => {
    const { isLoading, suggestedUser } = useGetSuggestedUser();
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("user-info");
            navigate('/auth');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (isLoading) {
        return <Text>Loading....</Text>;
    }

    return (
        <Container>
            <VStack py={8} px={6} gap={4}>
                <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
                    <Flex alignItems={"center"} gap={2}>
                        <Avatar size={"md"} src={user.profilePicUrl} />
                        <VStack alignItems={"flex-start"} gap={1}>
                            <Text fontSize={12} fontWeight={"bold"}>{user.username}</Text>
                            <Text fontSize={11} color={"gray"}>{user.name}</Text>
                        </VStack>
                    </Flex>

                    <Link fontSize={14} fontWeight={"medium"} color={"blue"} onClick={handleLogout} as={RouterLink} cursor='pointer' style={{ textDecoration: "none" }}>
                        Log Out
                    </Link>
                </Flex>

                {suggestedUser.length !== 0 && (
                    <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
                        <Text fontSize={12} fontWeight={"bold"} color={"gray"}>
                            Suggested for you
                        </Text>
                        <Text fontSize={12} fontWeight={"bold"} _hover={{ color: "gray" }} cursor={"pointer"}>
                            See All
                        </Text>
                    </Flex>
                )}


                {suggestedUser.map((user) => (
                    <SUser key={user.id} avatar={user.profilePicUrl} name={user.username} followers={user.followers.length} uid={user.uid} />
                ))}
            </VStack>
        </Container>
    );
};

export default SuggestedUser;
