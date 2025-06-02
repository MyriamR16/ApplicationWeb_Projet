import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import './style/Accueil.css';

import MeteoCard from '../components/MeteoCard';
import img1 from "../assets/img1.jpg";

function Accueil() {
  const [weather, setWeather] = useState(null);
  const position = [43.6, 1.44]; // Position Toulouse, France


  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=43.6&longitude=1.44&current_weather=true')
      .then((response) => response.json())
      .then((data) => setWeather(data.current_weather))
      .catch((error) => console.error('Erreur météo:', error));
  }, []);

    useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      fetch(`http://localhost:8081/api/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Erreur HTTP ' + res.status);
          return res.json();
        })
        .then(data => setUser(data))
        .catch(err => {
          setUser(null);
          console.error('Erreur chargement utilisateur:', err);
        });
    }
  }, []);

return (
  <div className="accueil-page">
    <Navigation />
    <div className="accueil-banner">
      <img className="accueil-img" src={img1} alt="img 1" />
      <div className="accueil-header-text">
        <h1 className="accueil-title">Run7 - Accueil</h1>
        <p className="accueil-subtitle">Bienvenue sur la page d'accueil de Run7 !</p>
      </div>
    </div>
    <Container fluid className="accueil-main-content">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <div className="accueil-about">
            <h2>À propos de Run7</h2>
            <p>
              Run7 est la plateforme pour les passionnés de course à pied à Toulouse. 
              Rejoignez-nous pour des événements, des défis et une communauté active !
            </p>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={10} lg={8}>
          <div className="accueil-weather-card">
            {weather && <MeteoCard weather={weather} position={position} />}
          </div>
        </Col>
      </Row>
    </Container>
  </div>
);
}

export default Accueil;

