import {
	Avatar,
	Button,
	Center,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
    Text
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../../context/PreviewImg";
import useEditProfile from "../../context/useEditProfile";
import useShowToast from '../showToast';

const EditProfile = ({ isOpen, onClose, profileData }) => {
    const [input,setInput] = useState({
        name:"",
        username:"",
        bio:""
    })

    const fileRef = useRef();
    const {selectedFile,setSelectedFile,handleImageChange} = usePreviewImg()
	const {editProfile,isUpdating} = useEditProfile({profileData})
	const showToast = useShowToast();

    // if (loading) {
    //     return <Text></Text>; // Show loading state
    //   }

    // if (error) {
    //     return <Text>Error fetching profile data</Text>; // Show error state
    //   }

    if (!profileData) {
        return <Text>No profile data found.</Text>; // Show message if no profile data is available
    }

    const handleSubmit = async() => {
        try{
			await editProfile(input,selectedFile);
			setSelectedFile(null);
			onClose()
		}catch(error){
			showToast("error",error.message,"error");
		}
    }

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent bg={"white"} boxShadow={"xl"} border={"1px solid gray"} mx={3}>
					<ModalHeader />
					<ModalCloseButton />
					<ModalBody>
						{/* Container Flex */}
						<Flex bg={"white"}>
							<Stack spacing={4} w={"full"} maxW={"md"} bg={"white"} p={6} my={0}>
								<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
									Edit Profile
								</Heading>
								<FormControl>
									<Stack direction={["column", "row"]} spacing={6}>
										<Center>
											<Avatar size='xl' src={selectedFile || profileData.profilePicUrl || ""} border={"2px solid white "} />
										</Center>
										<Center w='full'>
											<Button w='full' onClick={() => fileRef.current.click()}>Edit Profile Picture</Button>
										</Center>
                                        <Input type="file" hidden ref={fileRef} onChange={handleImageChange} />
									</Stack>
								</FormControl>

								<FormControl>
									<FormLabel fontSize={"sm"}>Full Name</FormLabel>
									<Input placeholder={"Full Name"} size={"sm"} type={"text"} value={input.name || profileData.name} onChange={(e) => setInput({...input,name: e.target.value})} />
								</FormControl>

								<FormControl>
									<FormLabel fontSize={"sm"}>Username</FormLabel>
									<Input placeholder={"Username"} size={"sm"} type={"text"} value={input.username || profileData.username} onChange={(e) => setInput({...input,username: e.target.value})}/>
								</FormControl>

								<FormControl>
									<FormLabel fontSize={"sm"}>Bio</FormLabel>
									<Input placeholder={"Bio"} size={"sm"} type={"text"} value={input.bio || profileData.bio} onChange={(e) => setInput({...input,bio: e.target.value})}/>
								</FormControl>

								<Stack spacing={6} direction={["column", "row"]}>
									<Button
										bg={"red.400"}
										color={"white"}
										w='full'
										size='sm'
										_hover={{ bg: "red.500" }}
                                        onClick={onClose}
									>
										Cancel
									</Button>
									<Button
										bg={"blue.400"}
										color={"white"}
										size='sm'
										w='full'
										_hover={{ bg: "blue.500" }}
                                        onClick={handleSubmit}
										isLoading={isUpdating}
									>
										Submit
									</Button>
								</Stack>
							</Stack>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default EditProfile;