import { InputGroup, Input, InputRightElement, Button, Flex, Box, Avatar, GridItem, Text, Image, Modal, useDisclosure, ModalContent, ModalCloseButton, ModalBody, ModalOverlay, Divider, VStack } from "@chakra-ui/react";
import { GoHeart, GoHeartFill, GoComment } from "react-icons/go";
import { FaHeart, FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Comment from "./Comment";
import { useState } from 'react';
import useAuthStore from "../../store/authStore";
import useUserProfileStore from "../../store/useProfileStore";
import useShowToast from "../showToast";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../firebase/firebase";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import usePostStore from "../../store/postStore";
import usePostComment from "../../context/usePostComment";
import useLikePost from "../../context/useLikePost"
import { timeAgo } from "../../utils/timeAgo";
import { useRef } from "react";

const Post = ({ post }) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const user = useAuthStore((state) => state.user);
    const userProfile = useUserProfileStore((state) => state.userProfile);
    const showToast = useShowToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const deletePost = usePostStore((state) => state.deletePost);
    const deletePostFromProfile = useUserProfileStore((state) => state.deletePost);
    const [comment, setComment] = useState('');
    const { isCommenting, handlePostComment } = usePostComment();
    const { isLiked, likes, handleLikePost } = useLikePost(post)
    const commentRef = useRef(null);


    if (!post) {
        return null;
    }

    const handleSubmitComment = async () => {
        await handlePostComment(post.id, comment);
        setComment('');
    };

    const handleDeletePost = async () => {
        if (!window.confirm("Are you sure you want to delete?")) return;
        if (isDeleting) return;

        try {
            setIsDeleting(true);
            const imageRef = ref(storage, `posts/${post.id}`);
            await deleteObject(imageRef);
            const userRef = doc(db, "users", user.uid);
            await deleteDoc(doc(db, "posts", post.id));
            await updateDoc(userRef, {
                posts: arrayRemove(post.id),
            });
            deletePost(post.id);
            deletePostFromProfile(post.id);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsDeleting(false);
        }
    };



    return (
        <>
            <GridItem
                cursor={"pointer"}
                borderRadius={4}
                overflow={"hidden"}
                border={"1px solid whiteAlpha"}
                position={"relative"}
                aspectRatio={1 / 1}
                onClick={onOpen}
            >
                <Flex
                    opacity={0}
                    _hover={{ opacity: 1 }}
                    bg={"blackAlpha.700"}
                    position={"absolute"}
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    zIndex={1}
                    transition={"all 0.3s ease"}
                    justifyContent={"center"}
                >
                    <Flex alignItems={"center"} justifyContent={"center"} gap={50}>
                        <Flex>
                            <FaHeart size={20} color="white" />
                            <Text fontWeight={"bold"} ml={2} color="white">
                                {likes}
                            </Text>
                        </Flex>

                        <Flex>
                            <FaComment size={20} color="white" />
                            <Text fontWeight={"bold"} ml={2} color="white">
                                {post?.comment?.length || 0}
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Image src={post.imageURL} alt="post 1" w={"100%"} h={"100%"} objectFit={"cover"} />
            </GridItem>

            <Modal isOpen={isOpen} onClose={onClose} isCentered={true} size={{ base: "3xl", md: "5xl" }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex gap={4} w={{ base: "90%", sm: "70%", md: "full" }} mx={"auto"} maxH={"90vH"} minH={"50vH"}>
                            <Flex
                                borderRadius={4}
                                overflow={"hidden"}
                                border={"1px solid"}
                                borderColor={"whiteAlpha.300"}
                                flex={1.5}
                                justifyContent={"center"}
                                alignItems={"center"}
                            >
                                <Image src={post.imageURL} alt="post" />
                            </Flex>
                            <Flex flex={1} flexDir={"column"} px={10} display={{ base: "none", md: "flex" }} borderLeft={"1px solid gainsboro"} >
                                <Flex alignItems={"center"} justifyContent={"space-between"} >
                                    <Flex alignItems={"center"} gap={4}>
                                        <Avatar size={"sm"} src={userProfile.profilePicUrl} alt='profile pic' />
                                        <Text fontSize={12} fontWeight={"bold"}>{userProfile.username} </Text>
                                    </Flex>
                                    {user?.uid === userProfile.uid && (
                                        <Button isLoading={isDeleting} borderRadius={4} p={1} _hover={{ color: "red" }} onClick={handleDeletePost} cursor={"pointer"}><MdDelete size={20} /> </Button>
                                    )}
                                </Flex>

                                <Divider my={4 - 1} />
                                <VStack w={"full"} alignItems={"start"} maxH={"450px"} overflow={"auto"}>
                                    {post.caption ? (
                                        <Flex gap={4 - 1} my={2}>
                                            <Avatar src={userProfile.profilePicUrl} size={"sm"} />
                                            <Flex direction={"column"}>
                                                <Flex gap={2} alignItems={"center"}>
                                                    <Text fontWeight={"bold"} fontSize={"12"}>
                                                        {userProfile.username}
                                                    </Text>
                                                    <Text fontSize={14}>{post.caption}</Text>
                                                </Flex>
                                                <Text fontSize={12} color={"gray"}>
                                                    {timeAgo(post.createdAt)}
                                                </Text>
                                            </Flex>

                                        </Flex>
                                    ) : (
                                        <></>
                                    )}
                                    {post.comment?.map((comment) => (

                                        <Comment key={comment.id} comment={comment} />
                                    )) || (
                                            <Text>No comments yet.</Text>
                                        )}
                                </VStack>

                                <Box mb={8} marginTop={"auto"}>
                                    <Divider my={4} />
                                    <Flex alignItems={"center"} gap={4} w={"full"} pt={0} mb={2} mt={4}>
                                        <Box onClick={handleLikePost} cursor={"pointer"} fontSize={25}>
                                            {!isLiked ? <GoHeart /> : <GoHeartFill color='red' />}
                                        </Box>
                                        <Box cursor={"pointer"} fontSize={25} onClick={() => commentRef.current.focus()}><GoComment /></Box>
                                    </Flex>

                                    <Text fontWeight={600} fontSize={"sm"}>
                                        {likes} likes
                                    </Text>

                                    <Flex
                                        alignItems={"center"}
                                        gap={2}
                                        justifyContent={"space-between"}
                                        w={"full"}
                                    >
                                        <InputGroup>
                                            <Input ref={commentRef} onChange={(e) => setComment(e.target.value)} value={comment} variant={"flushed"} placeholder='Add a comment....' fontSize={14} />
                                            <InputRightElement>
                                                <Button isLoading={isCommenting} onClick={handleSubmitComment} fontSize={14} color={"blue"} fontWeight={600} cursor={"pointer"} bg={"transparent"} _hover={{ bg: "transparent" }}>
                                                    Post
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </Flex>
                                </Box>
                            </Flex>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Post;
