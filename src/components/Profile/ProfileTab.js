import { Flex, Box, Text } from "@chakra-ui/react";
import { IoHeartOutline, IoBookmarkOutline, IoGridOutline } from "react-icons/io5";

const ProfileTabs = () => {
    return (
        <Flex
            w={"full"}
            justifyContent={"center"}
            gap={{ base: 4, sm: 10 }}
            textTransform={"uppercase"}
            fontWeight={"bold"}
        >
            <Flex borderTop={"1px solid Black"} alignItems={"center"} p="3" gap={1} cursor={"pointer"}>
                <Box fontSize={20}>
                    <IoGridOutline />
                </Box>
                <Text fontSize={12} display={{ base: "none", sm: "block" }}>Posts</Text>
            </Flex>

            <Flex alignItems={"center"} p="3" gap={1} cursor={"pointer"}>
                <Box fontSize={20}>
                    <IoBookmarkOutline />
                </Box>
                <Text fontSize={12} display={{ base: "none", sm: "block" }}>Saved</Text>
            </Flex>

            <Flex alignItems={"center"} p="3" gap={1} cursor={"pointer"}>
                <Box fontSize={20}>
                    <IoHeartOutline />
                </Box>
                <Text fontSize={12} display={{ base: "none", sm: "block" }}>Liked</Text>
            </Flex>

        </Flex>
    )
};

export default ProfileTabs