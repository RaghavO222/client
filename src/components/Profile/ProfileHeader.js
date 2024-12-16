import { Avatar, AvatarGroup, Flex, VStack, Text, Button, useDisclosure } from "@chakra-ui/react";
import EditProfile from "./EditProfile";
import { useAuth } from "../../context/AuthContext";
import useFollower from "../../context/useFollowUser";

import useUserProfileStore from "../../store/useProfileStore";

const ProfileHeader = () => {
    const { userProfile } = useUserProfileStore();

    const { user } = useAuth();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isFollowing, isUpdatingFollow, handleFollowUser } = useFollower(userProfile?.uid);




    if (!userProfile) {
        return <Text>Loading profile... in head</Text>;
    }

    const isOwnProfile = user?.uid === userProfile?.uid;

    return (
        <Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
            <AvatarGroup size={{ base: "xl", md: "2xl" }} justifySelf={"center"} alignSelf={"flex-start"} mx={"auto"}>
                <Avatar src={userProfile.profilePicUrl} alt='profile dp' />
            </AvatarGroup>

            <VStack alignItems={"start"} gap={2} mx={"auto"} flex={1}>
                <Flex
                    gap={4}
                    direction={{ base: "column", sm: "row" }}
                    justifyContent={{ base: "center", sm: "flex-start" }}
                    alignItems={"center"}
                    w={"full"}
                >
                    <Text fontSize={{ base: "sm", md: "lg" }}>{userProfile.username}</Text>

                    <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
                        {isOwnProfile ? (
                            <Button bg={"lightgray"} _hover={{ bg: "gray" }} size={{ base: "xs", md: "sm" }} onClick={onOpen}>
                                Edit Profile
                            </Button>
                        ) : (
                            <Button bg={"lightgray"} _hover={{ bg: "gray" }} size={{ base: "xs", md: "sm" }} onClick={handleFollowUser} isLoading={isUpdatingFollow}>
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                        )}
                    </Flex>
                </Flex>

                <Flex alignItems={"center"} gap={{ base: 2, sm: 4 }}>
                    <Text fontSize={{ base: "xs", md: "sm" }}>
                        <Text as="span" fontWeight={"bold"} mr={1}>{userProfile.posts.length}</Text>
                        Posts
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }}>
                        <Text as="span" fontWeight={"bold"} mr={1}>{userProfile?.followers?.length || 0}</Text>
                        Followers
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }}>
                        <Text as="span" fontWeight={"bold"} mr={1}>{userProfile?.following?.length || 0}</Text>
                        Following
                    </Text>
                </Flex>

                <Flex alignItems={"center"} gap={4}>
                    <Text fontSize={"sm"} fontWeight={"bold"}>{userProfile.name}</Text>
                </Flex>
                <Text fontSize={"sm"}>{userProfile.bio}</Text>
            </VStack>
            {isOpen && <EditProfile isOpen={isOpen} onClose={onClose} profileData={userProfile} />}
        </Flex>
    );
};

export default ProfileHeader;
