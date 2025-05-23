import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Index from './pages/Index'
import Accueil from './pages/Accueil'
import AjoutEvent from './pages/AjoutEvenement'
import Inscription from './pages/Inscription'
import Connexion from './pages/Connexion'
import ListeCourses from './pages/ListeCourses'
import Profil from './pages/Profil'
import ListeInscrits from './pages/ListeInscrits'

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/connexion" element={!isAuthenticated ? <Connexion /> : <Navigate to="/accueil" />} />
        <Route path="/inscription" element={!isAuthenticated ? <Inscription /> : <Navigate to="/accueil" />} />
        <Route path="/accueil" element={isAuthenticated ? <Accueil /> : <Navigate to="/connexion" />} />
        <Route path="/ajoutevent" element={isAuthenticated ? <AjoutEvent /> : <Navigate to="/connexion" />} />
        <Route path="/listecourses" element={isAuthenticated ? <ListeCourses /> : <Navigate to="/connexion" />} />
        <Route path="/profil" element={isAuthenticated ? <Profil /> : <Navigate to="/connexion" />} />
        <Route path="/profil/:id" element={isAuthenticated ? <Profil /> : <Navigate to="/connexion" />} />
        <Route path="/listeinscrits" element={isAuthenticated ? <ListeInscrits /> : <Navigate to="/listeinscrits" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App