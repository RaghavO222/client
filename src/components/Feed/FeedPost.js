import { Container, Flex, SkeletonCircle, VStack, Skeleton, Box, Text } from "@chakra-ui/react";
import Feed from "./Feed";
import useGetFeedPost from "../../context/useGetFeedPost";
import useAuthStore from "../../store/authStore";

const FeedPost = () => {
    const { isLoading, posts } = useGetFeedPost();
    const { user } = useAuthStore();

    return (
        <Container>
            {isLoading && [0, 1, 2].map((_, idx) => (
                <VStack key={idx} gap={4} alignItems={"flex-start"} mb={10}>
                    <Flex gap={2}>
                        <SkeletonCircle size={10} />
                        <VStack gap={2} alignItems={"flex-start"}>
                            <Skeleton height='10px' w={"100px"} />
                            <Skeleton height='10px' w={"200px"} />
                        </VStack>
                    </Flex>
                    <Skeleton w={"full"} >
                        <Box h={"500px"}>content here</Box>
                    </Skeleton>
                </VStack>
            ))}
            {!isLoading && posts.length > 0 && posts.map((post) => <Feed key={post.id} post={post} />)}
            {!isLoading && user.following.length === 0 && (
                <>
                    <Text fontSize={"md"}>
                        You don't follow anyone
                        follow people to see their post
                    </Text>
                </>
            )}
            {!isLoading && posts.length === 0 && (
                <>
                    <Text fontSize={"md"}>
                        Nothing to Show
                    </Text>
                </>
            )}
        </Container>
    )
};

export default FeedPost