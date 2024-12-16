import { HStack, Container, Flex, Text, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileTab from "../components/Profile/ProfileTab";
import ProfilePost from "../components/Profile/ProfilePost";
import useProfileData from "../context/getProfileData";
import useShowToast from "../components/showToast";
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
    const { uid } = useParams();

    const showToast = useShowToast();
    const { userProfile, loading, error } = useProfileData({ uid });

    if (loading) {
        return (
            <>
                <Container maxW="container.lg" py={100} px={20}>

                    <Flex direction="column" gap={6} pb={10}>
                        <HStack spacing={6}>
                            <SkeletonCircle size="100px" />
                            <VStack align="flex-start" spacing={4}>
                                <Skeleton height="20px" width="150px" />

                                <Skeleton height="20px" width="200px" />
                            </VStack>
                        </HStack>
                    </Flex>



                    <Flex wrap="wrap" gap={4}>
                        <Skeleton height="20px" width="842px" />
                        <Skeleton height="270px" width="270px" />
                        <Skeleton height="270px" width="270px" />
                        <Skeleton height="270px" width="270px" />

                    </Flex>
                </Container>
            </>
        )
    }

    if (error) {
        showToast("Error", error.message, "error");
        return (<><Text>Error fetching profile data</Text>;</>)
    }

    if (!userProfile) {
        return <Text>No profile data found.</Text>;
    }

    return (
        <>

            {!loading && (
                <Container maxW={"container.lg"} py={5}>
                    <Flex
                        py={10}
                        px={4}
                        pl={{ base: 4, md: 10 }}
                        w={"full"}
                        mx={"auto"}
                        flexDirection={"column"}
                    >
                        <ProfileHeader />
                    </Flex>

                    <Flex
                        px={{ base: 2, md: 4 }}
                        maxW={"full"}
                        mx={"auto"}
                        borderTop={"1px solid gainsboro"}
                        borderColor={"whiteAlpha"}
                        direction={"column"}
                    >
                        <ProfileTab />
                        <ProfilePost />
                    </Flex>
                </Container>
            )}

        </>

    )
}

export default ProfilePage;