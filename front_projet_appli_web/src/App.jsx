import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'leaflet/dist/leaflet.css';
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
import ListeGroupes from './pages/ListeGroupesAmis'
import AjoutGroupeAmis from './pages/AjoutGroupeAmis'
import GroupeAmis from './pages/GroupeAmis'
import Discussion from './pages/Discussion'
import ListeDiscussions from './pages/ListeDiscussions'

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
        <Route path="/listegroupes" element={<ListeGroupes />} />
        <Route path="/ajoutgroupe" element={<AjoutGroupeAmis />} />
        <Route path="/groupeamis/:id" element={<GroupeAmis />} />
        <Route path="/discussion/:id" element={<Discussion />} />
        <Route path="/discussions" element={<ListeDiscussions />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
