import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo-1.png";
import "../pages/style/Navigation.css";

function Navigation() {
  return (
    <Navbar expand="md" className="custom-navbar" variant="light">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/accueil">
          <img src={logo} alt="Run7 Logo" className="navbar-logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/accueil">Accueil</Nav.Link>
            <NavDropdown title="Événements" id="events-dropdown">
              <NavDropdown.Item as={NavLink} to="/listecourses">Rechercher une course</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/ajoutevent">Créer un événement</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Communauté" id="community-dropdown">
              <NavDropdown.Item disabled>Liste des amis / groupes de running</NavDropdown.Item>
              <NavDropdown.Item disabled>Forum / discussions</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/listeinscrits">Liste des inscrits</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Défis" id="defis-dropdown">
              <NavDropdown.Item disabled>Défis hebdomadaires/mensuels</NavDropdown.Item>
              <NavDropdown.Item disabled>Classements</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={NavLink} to="/profil">Profil</Nav.Link>
            <Nav.Link as={NavLink} to="/connexion">Déconnexion</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;