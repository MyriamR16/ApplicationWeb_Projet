import React from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import './style/Index.css' 
import logo from '../assets/logo-1.png'
import image_runners from '../assets/runners_3.png'
import { Container, Row, Col, Card } from 'react-bootstrap';

function Index() {
  return (
    <div className="index-container">
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card className="index-box p-4" style={{ maxWidth: '800px', width: '100%', boxShadow: '0 8px 32px rgba(10, 155, 143, 0.612)' }}>
          <Row className="g-0 align-items-stretch">
            <Col md={7} className="d-flex flex-column justify-content-center align-items-center p-4">
              <img src={logo} alt="RUN7 Logo" className="index-logo" />
              <h1 className="index-title">Authentification</h1>
              <div className="index-btn-group mt-4">
                <Link to="/connexion">
                  <Button type="button" variant="primary">Connexion</Button>
                </Link>
                <Link to="/inscription">
                  <Button type="button" variant="outline-primary">Inscription</Button>
                </Link>
              </div>
            </Col>
            <Col md={5} className="d-flex justify-content-center align-items-center p-3 index-image-section">
              <img
                src={image_runners}
                alt="Accueil Illustration"
                className="index-image img-fluid rounded h-100"
                style={{ objectFit: 'cover', maxHeight: 'none', width: '100%' }}
              />
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  )
}
export default Index