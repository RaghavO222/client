import { Avatar, Flex, Text } from "@chakra-ui/react"
import useSepProfileData from "../../context/sepProfileData";
import { timeAgo } from "../../utils/timeAgo";
import { Link } from "react-router-dom";

const Comment = ({ comment }) => {
    const uidi = comment.createdBy;
    const { isLoading, userProfile } = useSepProfileData({ uid: uidi });

    return (
        <>

            {isLoading ? (
                <Text>Loading...</Text>
            ) : userProfile ? (
                <Flex gap={3}>
                    <Link to={`/profile/${userProfile.uid}`}>
                        <Avatar src={userProfile.profilePicUrl || ""} size={"sm"} />
                    </Link>
                    <Flex direction={"column"}>
                        <Flex gap={2} alignItems={"center"}>
                            <Link to={`/profile/${userProfile.uid}`}>
                                <Text fontWeight={"bold"} fontSize={"12"}>
                                    {userProfile.username || "Unknown User"}
                                </Text>
                            </Link>
                            <Text fontSize={14}>{comment.comments}</Text>
                        </Flex>
                        <Text fontSize={12} color={"gray"}>
                            {timeAgo(comment.createdAt)}
                        </Text>
                    </Flex>
                </Flex>
            ) : (
                <Text>User data unavailable</Text>
            )}
        </>
    )
}

export default Comment;