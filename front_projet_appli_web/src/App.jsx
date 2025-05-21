import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Accueil from './pages/Accueil'
import AjoutEvent from './pages/AjoutEvenement'
import Inscription from './pages/Inscription'
import Connexion from './pages/Connexion'
import ListeCourses from './pages/ListeEvents'
import Profil from './pages/Profil'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/ajoutevent" element={<AjoutEvent />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/listecourses" element={<ListeCourses />} />
        <Route path="/profil" element={<Profil />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
