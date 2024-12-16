import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { ChakraProvider } from '@chakra-ui/react'
import { useState } from "react";

import './App.css';

import AuthPage from './pages/Auth';
import HomePage from './pages/Home';
import PageLayout from './Layout/pageLayout';
import ProfilePage from './pages/Profile';

function AppContent() {
  const { user } = useAuth();
  const [isClicked, setIsClicked] = useState(false);
  return (
    <PageLayout isClicked={isClicked} setIsClicked={setIsClicked}>
      <Routes>
        <Route
          path='/'
          element={user ? <HomePage isClicked={isClicked} setIsClicked={setIsClicked} /> : <AuthPage />}
        />
        <Route
          path='/auth'
          element={!user ? <AuthPage /> : <HomePage />}
        />
        <Route
          path='/profile/:uid'
          element={user ? <ProfilePage /> : <AuthPage />}
        />
      </Routes>
    </PageLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ChakraProvider>
          <AppContent />
        </ChakraProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;