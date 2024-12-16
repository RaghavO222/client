import { Flex, Grid, Text } from "@chakra-ui/react";
import Post from "./Post";
import useGetUserPosts from "../../context/useGetUserPosts";

const ProfilePost = ({ uid }) => {

    const { isLoading, posts } = useGetUserPosts(uid);

    const noPost = !isLoading && posts.length === 0;

    if (noPost) {
        return (
            <Flex flexDir="column" textAlign={"center"} mx={"auto"} mt={10}>
                <Text fontSize={"2xl"} >No post yet</Text>
            </Flex>
        )
    }

    return (
        <>
            {isLoading && (
                <Flex flexDir="column" textAlign={"center"} mx={"auto"} mt={10}>
                    <Text fontSize={"2xl"} >Loading</Text>
                </Flex>
            )}
            {!isLoading && (
                <Grid
                    templateColumns={{
                        sm: "repeat(1,1fr)",
                        md: "repeat(3,1fr)"
                    }}
                    gap={1}
                    columnGap={1}
                >

                    {posts.map((post) => (
                        <Post post={post} key={post.id} />
                    ))}
                </Grid>
            )}
        </>
    )
};

export default ProfilePost

