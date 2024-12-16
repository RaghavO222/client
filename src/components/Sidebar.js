import { Box, VStack, Image, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { AiOutlineAliwangwang, AiOutlineMessage } from "react-icons/ai";
import { GoHome, GoSearch, GoHeart, GoPlusCircle } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";
import { Avatar } from '@chakra-ui/react'
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Search from './sidebar/search';
import Create from './sidebar/Create';
import { useState } from 'react';

const Sidebar = ({ isClicked, setIsClicked }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("user-info");
            localStorage.removeItem("user");
            navigate('/auth');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleNavigation = (path) => {
        setIsClicked(false);
        navigate(path);
    };

    const handleSearchClicked = () => {
        setIsClicked(prevState => !prevState);
    }

    const handleCreateClicked = () => {
        setIsCreateOpen(true);
    };

    const handleCreateClose = () => {
        setIsCreateOpen(false);
    };


    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>

            {!isClicked && (
                <Box
                    height={"100vh"}
                    borderRight={"1px solid"}
                    borderColor={"black"}
                    py={8}
                    position={"sticky"}
                    top={0}
                    left={0}
                    px={{ base: 4, md: 4 }}
                >

                    <VStack gap={10} w={"full"} h={"full"} display={"flex"} justifyContent={{ base: "none", md: "left" }} alignItems={{ base: "none", md: "left" }}>

                        <Link onClick={() => handleNavigation("/")} mt={10} display={{ base: "none", md: "block" }} cursor='pointer'>
                            <Image src="/unai2.PNG" alt='logo' h={51} w={175} cursor={'pointer'} />
                        </Link>


                        <Link onClick={() => handleNavigation("/")} mt={10} display={{ base: "flex", md: "none" }} borderRadius={6} _hover={{ bg: "gainsboro" }} h={10} w={10} alignItems="center" justifyContent="center" cursor='pointer'>
                            <AiOutlineAliwangwang fontSize="29px" />
                        </Link>

                        <VStack gap={5} cursor={"pointer"} >
                            <Link onClick={() => handleNavigation("/")} display={"Flex"} p={{ base: "none", md: 4 }} alignItems="center" justifyContent={{ base: "center", md: "left" }} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={{ base: 10, md: "full" }} cursor='pointer'>
                                <GoHome fontSize="29px" />
                                <Box display={{ base: "none", md: "block" }}>Home</Box>
                            </Link>

                            <Link display={"Flex"} p={{ base: "none", md: 4 }} onClick={handleSearchClicked} alignItems="center" justifyContent={{ base: "center", md: "left" }} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={{ base: 10, md: "full" }} cursor='pointer'>
                                <GoSearch fontSize="29px" />
                                <Box display={{ base: "none", md: "block" }}>Search</Box>
                            </Link>

                            <Link display={"Flex"} p={{ base: "none", md: 4 }} onClick={() => handleNavigation("/messages")} alignItems="center" justifyContent={{ base: "center", md: "left" }} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={{ base: 10, md: "full" }} cursor='pointer'>
                                <AiOutlineMessage fontSize="29px" />
                                <Box display={{ base: "none", md: "block" }}>Message</Box>
                            </Link>

                            <Link display={"Flex"} p={{ base: "none", md: 4 }} onClick={() => handleNavigation("/notifications")} alignItems="center" justifyContent={{ base: "center", md: "left" }} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={{ base: 10, md: "full" }} cursor='pointer'>
                                <GoHeart fontSize="29px" />
                                <Box display={{ base: "none", md: "block" }}>Notifications</Box>
                            </Link>

                            <Link display={"Flex"} p={{ base: "none", md: 4 }} onClick={handleCreateClicked} alignItems="center" justifyContent={{ base: "center", md: "left" }} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={{ base: 10, md: "full" }} cursor='pointer'>
                                <GoPlusCircle fontSize="29px" />
                                <Box display={{ base: "none", md: "block" }}>Create</Box>
                            </Link>

                            <Link display={"Flex"} p={{ base: "none", md: 4 }} onClick={() => handleNavigation(`/profile/${user.uid}`)} alignItems="center" justifyContent={{ base: "center", md: "left" }} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={{ base: 10, md: "full" }} cursor='pointer'>
                                <Avatar size='sm' name='Kent Dodds' src='https://static.vecteezy.com/system/resources/previews/001/840/612/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg' />
                                <Box display={{ base: "none", md: "block" }}>Profile</Box>
                            </Link>
                        </VStack>

                        <Link display={"Flex"} p={{ base: "none", md: 4 }} mt={'auto'} onClick={handleLogout} as={RouterLink} alignItems="center" justifyContent={{ base: "center", md: "left" }} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={{ base: 10, md: "full" }} cursor='pointer'>
                            <IoLogOutOutline fontSize="29px" />
                            <Box display={{ base: "none", md: "block" }}>Log Out</Box>
                        </Link>

                    </VStack>

                </Box>
            )}

            {isClicked && (
                <>
                    <Box display={"flex"} height={"100vh"} >
                        <Box
                            height={"100vh"}
                            w={"70px"}
                            borderRight={"1px solid"}
                            borderColor={"black"}
                            py={8}
                            position={"fixed"}
                            top={0}
                            left={0}
                            px={4}
                        >
                            <VStack gap={10} h={"full"} display={"flex"} justifyContent={"none"} alignItems={"none"}>
                                <Link onClick={() => handleNavigation("/")} mt={10} display={"flex"} borderRadius={6} _hover={{ bg: "gainsboro" }} h={10} w={10} alignItems="center" justifyContent="center" cursor='pointer'>
                                    <AiOutlineAliwangwang fontSize="29px" />
                                </Link>

                                <VStack gap={5} cursor={"pointer"} mt={11}>
                                    <Link display={"Flex"} p={"none"} onClick={() => handleNavigation("/")} alignItems="center" justifyContent={"center"} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={10} cursor='pointer'>
                                        <GoHome fontSize="29px" />
                                    </Link>

                                    <Link display={"Flex"} p={"none"} onClick={handleSearchClicked} alignItems="center" justifyContent={"center"} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={10} cursor='pointer'>
                                        <GoSearch fontSize="29px" />
                                    </Link>

                                    <Link display={"Flex"} p={"none"} onClick={() => handleNavigation("/messages")} alignItems="center" justifyContent={"center"} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={10} cursor='pointer'>
                                        <AiOutlineMessage fontSize="29px" />
                                    </Link>

                                    <Link display={"Flex"} p={"none"} onClick={() => handleNavigation("/notifications")} alignItems="center" justifyContent={"center"} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={10} cursor='pointer'>
                                        <GoHeart fontSize="29px" />
                                    </Link>

                                    <Link display={"Flex"} p={"none"} onClick={() => handleNavigation("/create")} alignItems="center" justifyContent={"center"} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={10} cursor='pointer'>
                                        <GoPlusCircle fontSize="29px" />
                                    </Link>

                                    <Link display={"Flex"} p={"none"} onClick={() => handleNavigation(`/profile/${user.uid}`)} alignItems="center" justifyContent={"center"} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={10} cursor='pointer'>
                                        <Avatar size='sm' name='Kent Dodds' src='https://static.vecteezy.com/system/resources/previews/001/840/612/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg' />
                                    </Link>
                                </VStack>

                                <Link display={"Flex"} p={"none"} mt={'auto'} onClick={handleLogout} as={RouterLink} alignItems="center" justifyContent={"center"} gap={2} _hover={{ bg: "gainsboro" }} borderRadius={6} h={12} w={10} cursor='pointer'>
                                    <IoLogOutOutline fontSize="29px" />
                                </Link>
                            </VStack>
                        </Box>
                        <Box ml={"70px"}>
                            <Search setIsClicked={setIsClicked} />
                        </Box>
                    </Box>

                </>
            )}

            <Create isOpen={isCreateOpen} onClose={handleCreateClose} />
        </>
    )
}

export default Sidebar;
