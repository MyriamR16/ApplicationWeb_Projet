import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Accueil from './pages/Accueil'
import AjoutEvent from './pages/AjoutEvenement'
import Inscription from './pages/Inscription'
import Connexion from './pages/Connexion'
import ListeCourses from './pages/ListeCourses'
import Profil from './pages/Profil'
import ListeInscrits from './pages/ListeInscrits'
import MesInfos from './pages/MesInfos'
import MesCourses from './pages/MesCourses'

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
        <Route path="/listeinscrits" element={<ListeInscrits />} />
        <Route path="/mesinfos" element={<MesInfos />} />
        <Route path="/mescourses" element={<MesCourses />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
