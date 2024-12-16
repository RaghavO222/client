import { Flex, Box } from "@chakra-ui/react"
import Sidebar from "../components/Sidebar"
import { useLocation } from "react-router-dom"
import React from 'react';

const PageLayout = ({ children, isClicked, setIsClicked }) => {
    const { pathname } = useLocation()

    return (
        <Flex gap={isClicked && { lg: 240 }}>
            {pathname !== '/auth' ? (
                <Box w={{ base: "70px", md: "240px" }}>
                    <Sidebar isClicked={isClicked} setIsClicked={setIsClicked} />
                </Box>
            ) : null}

            <Box flex={1} w={{ base: "calc(100% - 70px)", md: "calc(100% - 240px)" }}>
                {children}
            </Box>

        </Flex>
    )
}

export default PageLayout

