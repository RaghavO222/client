import {
  Text,
  Flex,
  Box,
  Avatar,
  Image,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Modal, useDisclosure, ModalContent, ModalCloseButton, ModalBody, ModalOverlay, Divider, VStack
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { GoHeart, GoHeartFill, GoComment } from "react-icons/go";
import useSepProfileData from "../../context/sepProfileData";
import useLikePost from "../../context/useLikePost"
import { timeAgo } from "../../utils/timeAgo"
import { Link } from "react-router-dom";
import useFollower from "../../context/useFollowUser";
import usePostComment from "../../context/usePostComment";
import { MdDelete } from "react-icons/md";
import Comment from "../Profile/Comment"
import useUserProfileStore from "../../store/useProfileStore";
import usePostStore from "../../store/postStore";
import useShowToast from "../showToast";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../firebase/firebase";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import useAuthStore from "../../store/authStore";

const Feed = ({ post }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isLoading, userProfile } = useSepProfileData({ uid: post.createdBy });
  const { isLiked, likes, handleLikePost } = useLikePost(post)
  const { isFollowing, isUpdatingFollow, handleFollowUser } = useFollower(userProfile?.uid);
  const [comment, setComment] = useState('');
  const { isCommenting, handlePostComment } = usePostComment();
  const commentRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePost = usePostStore((state) => state.deletePost);
  const deletePostFromProfile = useUserProfileStore((state) => state.deletePost);
  const showToast = useShowToast();
  const user = useAuthStore((state) => state.user);

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

  const handleSubmitComment = async () => {
    await handlePostComment(post.id, comment);
    setComment('');
  };


  return (
    <>
      {isLoading ? (
        <></>
      ) : userProfile ? (
        <>
          <Flex
            pt={5}
            justifyContent={"space-between"}
            alignItems={"center"}
            w={"full"}
            mb={2}
          >
            <Flex alignItems={"center"} gap={2} cursor={"pointer"}>
              <Link to={`/profile/${userProfile.uid}`}>
                <Avatar
                  src={userProfile.profilePicUrl || ""}
                  alt="user dp"
                  size={"sm"}
                />
              </Link>
              <Flex fontSize={12} fontWeight={"bold"} gap={2}>
                <Link to={`/profile/${userProfile.uid}`}>
                  <Text>{userProfile.username || "Unknown User"}</Text>
                </Link>
                <Box color={"gray"}>* {timeAgo(post.createdAt)}</Box>
              </Flex>
            </Flex>

            <Box cursor={"pointer"}>
              <Text fontSize={12} fontWeight={"bold"} color={"blue"} onClick={handleFollowUser} isLoading={isUpdatingFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </Box>
          </Flex>

          <Box>
            <Image
              borderRadius={4}
              overflow={"hidden"}
              src={post.imageURL}
              alt="user pic"
            />
          </Box>

          <Flex alignItems={"center"} gap={4} w={"full"} pt={0} mb={2} mt={4}>
            <Box onClick={handleLikePost} cursor={"pointer"} fontSize={25}>
              {!isLiked ? <GoHeart /> : <GoHeartFill color="red" />}
            </Box>

            <Box cursor={"pointer"} fontSize={25} onClick={() => commentRef.current.focus()}>
              <GoComment />
            </Box>
          </Flex>

          <Text fontWeight={600} fontSize={"sm"}>
            {likes} likes
          </Text>

          <Text fontWeight={700} fontSize={"sm"}>
            {userProfile.username}{" "}
            <Text as="span" fontWeight={400}>
              {post.caption}
            </Text>
          </Text>
          <Text fontSize={"sm"} color={"gray"} onClick={onOpen} cursor="pointer">
            View all comments
          </Text>

          <Flex
            alignItems={"center"}
            gap={2}
            justifyContent={"space-between"}
            w={"full"}
          >
            <InputGroup>
              <Input
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                variant={"flushed"}
                placeholder="Add a comment...."
                fontSize={14}
                ref={commentRef}
              />
              <InputRightElement>
                <Button
                  isLoading={isCommenting}
                  onClick={handleSubmitComment}
                  fontSize={14}
                  color={"blue"}
                  fontWeight={600}
                  cursor={"pointer"}
                  bg={"transparent"}
                  _hover={{ bg: "transparent" }}
                >
                  Post
                </Button>
              </InputRightElement>
            </InputGroup>
          </Flex>


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
      ) : (
        <Text>User profile not found.</Text>
      )}



    </>
  );
};

export default Feed;
