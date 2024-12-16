import { Box, Input, Text, VStack, SkeletonCircle, Skeleton, Flex } from "@chakra-ui/react"
import { GoX } from "react-icons/go";
import SearchedProfiles from './SearchedProfiles'
import { useCallback, useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import { useAuth } from "../../context/AuthContext";

const Search = ({ setIsClicked }) => {
    const { user } = useAuth();
    const [value, setValue] = useState('')
    const [profiles, setProfiles] = useState([])
    const [loading, setLoading] = useState(false)
    const [showNoResults, setShowNoResults] = useState(false)

    const cls = () => {
        setIsClicked(false);
    }

    const fetchProfiles = useCallback(
        async (searchValue) => {
            setLoading(true);
            setShowNoResults(false);
            try {
                const usersRef = collection(db, "users");
                const q = query(
                    usersRef,
                    where("username", ">=", searchValue),
                    where("username", "<=", searchValue + "\uf8ff")
                );
                const querySnapshot = await getDocs(q);

                const results = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.uid !== user.uid) {
                        results.push(data);
                    }
                });

                setProfiles(results);
                if (results.length === 0) {
                    setTimeout(() => {
                        setShowNoResults(true);
                    }, 500);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profiles: ", error);
            }
        },
        [user.uid]
    );

    useEffect(() => {
        if (value.length > 0) {
            const debounce = setTimeout(() => {
                fetchProfiles(value);
            }, 300);
            return () => clearTimeout(debounce);
        } else {
            setProfiles([]);
            setShowNoResults(false)
        }
    }, [value, fetchProfiles]);

    return (
        <>
            <Box
                height={{ base: "100vh", lg: "100vh" }}
                w={{ base: "85vw", md: "90vw", lg: 400 }}
                borderRight={{ base: "none", lg: "1px solid" }}
                borderColor={{ base: "transparent", lg: "black" }}
                py={8}
                position={"fixed"}
                top={0}
                px={4}
                bg={"white"}
                boxShadow={{ base: "none", lg: '8px 0 15px 1px rgba(230, 230, 230, 1)' }}
                rounded='lg'
                zIndex={999}
            >
                <VStack gap={7} justifyContent={"none"} alignItems={"none"} mt={10} >
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text as='b' fontSize='2xl'>Search</Text>
                        <Box onClick={cls} cursor='pointer' _hover={{ bg: "gainsboro" }} borderRadius={6}>
                            <GoX fontSize="29px" />
                        </Box>
                    </Flex>

                    <Input
                        variant='filled'
                        placeholder='Search'
                        onChange={(event) => setValue(event.target.value)}
                        value={value}
                    />
                    <Text borderBottom={"1px solid Black"}></Text>

                    {loading ? (
                        <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
                            <Flex alignItems={"center"} gap={2}>
                                <SkeletonCircle size={10} />
                                <VStack gap={2} alignItems={"flex-start"}>
                                    <Skeleton height='7px' w={"50px"} />
                                    <Skeleton height='7px' w={"100px"} />
                                </VStack>
                            </Flex>
                        </Flex>
                    ) : (
                        <VStack gap={4}>
                            {profiles.length > 0 ? (
                                profiles.map((profile, index) => (
                                    <SearchedProfiles key={index} profile={profile} setIsClicked={setIsClicked} />
                                ))
                            ) : (
                                showNoResults && value.length > 0 && <Text>No profiles found</Text>
                            )}
                        </VStack>
                    )}
                </VStack>
            </Box>
        </>
    )
}

export default Search;