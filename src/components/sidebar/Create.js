import { Avatar, Box, Image, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, CloseButton, VStack, Textarea } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { TbPhoto } from "react-icons/tb";
import usePreviewImg from '../../context/PreviewImg'
import { useAuth } from "../../context/AuthContext"
import useShowToast from "../showToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore"
import useUserProfileStore from "../../store/useProfileStore";
import { arrayUnion, doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "../../firebase/firebase"
import { useLocation } from "react-router-dom";

const Create = ({ isOpen, onClose }) => {
    const [caption, setCaption] = useState('');
    const { user } = useAuth();
    const imageRef = useRef(null);
    const { handleImageChange, selectedFile, setSelectedFile } = usePreviewImg();
    const { isLoading, handleCreatePost } = useCreatePost();
    const showToast = useShowToast();

    const handlePost = async () => {
        try {
            await handleCreatePost(selectedFile, caption);
            onClose()
            setCaption('')
            setSelectedFile(null)
        } catch (error) {
            showToast("Error", error.message, "error")
        }

    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size='4xl' isCentered>
                <ModalOverlay />
                <ModalContent bg={"white"} border={"1px solid gray"} height="680px">
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton onClick={() => setSelectedFile("")} />
                    <Text borderBottom={"1px solid gray"}></Text>
                    <ModalBody>
                        {!selectedFile && (
                            <Flex direction="column" justifyContent="center" alignItems="center" height="100%">
                                <TbPhoto fontSize='70px' />
                                <Button size='sm'
                                    mt={4}
                                    colorScheme='blue'
                                    onClick={() => imageRef.current.click()}
                                >
                                    Select Photo
                                </Button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={imageRef}
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                            </Flex>
                        )}

                        {selectedFile && (
                            <Flex>
                                <Box
                                    justifyContent="left"
                                    alignItems="flex-start"
                                    position="relative"
                                    bottom={2}
                                    right={6}
                                    w={"70%"}
                                    h={"100%"}
                                >
                                    <Image
                                        src={selectedFile}
                                        alt='Selected Img'
                                        height="615px"
                                        width="100%"
                                        objectFit="fill"
                                        ml={0}
                                    />
                                    <CloseButton
                                        position="absolute"
                                        top={2}
                                        right={2}
                                        bg="transparent"
                                        onClick={() => setSelectedFile("")}
                                    />

                                </Box>

                                <VStack alignItems="flex-start" width='30%'>
                                    <Flex gap={2} justifyContent="center" alignItems="center">
                                        <Avatar size={"sm"} src={user.profilePicUrl} />
                                        <Text fontSize={12} fontWeight={"bold"}>{user.username}</Text>
                                    </Flex>
                                    <Textarea
                                        placeholder="Write a caption..."
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        width='100%'
                                    />
                                    <Button onClick={handlePost} isLoading={isLoading}>Post</Button>
                                </VStack>
                            </Flex>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Create;

function useCreatePost() {
    const showToast = useShowToast();
    const [isLoading, setIsLoading] = useState(null);
    const user = useAuthStore((state) => state.user);
    const createPost = usePostStore((state) => state.createPost);
    const addPost = useUserProfileStore((state) => state.addPost);
    const userProfile = useUserProfileStore((state) => state.userProfile);
    const { pathname } = useLocation();

    const handleCreatePost = async (selectedFile, caption) => {
        if (isLoading) { return }
        if (!selectedFile) {
            throw new Error("Please select an image");
        }
        setIsLoading(true)
        const newPost = {
            caption: caption,
            likes: [],
            comment: [],
            createdAt: Date.now(),
            createdBy: user.uid
        }

        try {
            const postDocRef = await addDoc(collection(db, "posts"), newPost);
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });
            const imageRef = ref(storage, `posts/${postDocRef.id}`);
            await uploadString(imageRef, selectedFile, "data_url");
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(postDocRef, { imageURL: downloadURL });

            newPost.imageURL = downloadURL;


            if (userProfile.uid === user.uid) {
                createPost({ ...newPost, id: postDocRef.id });
            }

            if (pathname !== '/' && userProfile.uid === user.uid) {
                addPost({ ...newPost, id: postDocRef.id });
            }


            showToast("Success", "Post added successfully", "success")
        } catch (error) {
            showToast("Error", error.message, "error")
        } finally {
            setIsLoading(false);
        }
    }
    return { isLoading, handleCreatePost };
}
