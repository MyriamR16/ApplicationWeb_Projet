import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { Container, Table, Spinner, Alert, Form, Button, Row, Col } from 'react-bootstrap';
import './style/ListeInscrits.css';

export function getLevelColor(niveau) {

 switch (niveau?.toUpperCase()) {
    case 'DEBUTANT':
      return 'rgba(155, 23, 232, 0.961)';
    case 'INTERMEDIAIRE':
      return 'rgba(21, 185, 255, 0.961)';
    case 'AVANCE':
      return 'rgba(16, 216, 46, 0.989)';
    case 'EXPERT':
      return 'rgba(202, 54, 79, 0.989)';
    default:
      return '#A0AEC0';
  }
}

function getLevelColorClass(niveau) {
  switch (niveau?.toUpperCase()) {
    case 'DEBUTANT':
      return 'debutant';
    case 'INTERMEDIAIRE':
      return 'intermediaire';
    case 'AVANCE':
      return 'avance';
    case 'EXPERT':
      return 'expert';
    default:
      return '';
  }
}

function ListeInscrits() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pseudoSearch, setPseudoSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('TOUS');
  const [currentUser, setCurrentUser] = useState(null);

  const role = localStorage.getItem('role');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId && token) {
      fetch(`http://localhost:8081/api/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Utilisateur non trouvé');
          return res.json();
        })
        .then((data) => setCurrentUser(data))
        .catch((err) => console.error('Erreur chargement utilisateur:', err));
    }
    if (token) {
      fetch('http://localhost:8081/api/user/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Erreur lors du chargement');
          return res.json();
        })
        .then((data) => {
          setUsers(data);
          setFilteredUsers(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    let results = users;
    if (pseudoSearch) {
      results = results.filter((user) =>
        user.pseudo.toLowerCase().includes(pseudoSearch.toLowerCase())
      );
    }
    if (levelFilter !== 'TOUS') {
      results = results.filter((user) => user.niveau === levelFilter);
    }
    setFilteredUsers(results);
  }, [pseudoSearch, levelFilter, users]);

  function handleDeleteUser(userId) {
    const token = localStorage.getItem('token');
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    fetch(`http://localhost:8081/api/moderateur/personne/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la suppression');
        alert('Utilisateur supprimé !');
        setUsers(users.filter((u) => u.id !== userId));
      })
      .catch((err) => alert('Erreur : ' + err.message));
  }

  if (loading)
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );

  if (error)
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Alert variant="danger">Erreur : {error}</Alert>
      </Container>
    );

  return (
    <>
      <Navigation />
      <div className="listeinscrits-bg">
        <div className="listeinscrits-container">
          {currentUser && (
            <div className="text-center mb-3 fw-bold fs-5 bonjour-blanc">Bonjour {currentUser.pseudo} !</div>
          )}
          <h2 className="mb-4 text-center">Liste des inscrits</h2>
          <Row className="mb-3 justify-content-center">
            <Col xs={12} md={6} lg={5} className="mb-2 mb-md-0">
              <Form.Control
                type="text"
                placeholder="Rechercher un pseudo..."
                value={pseudoSearch}
                onChange={(e) => setPseudoSearch(e.target.value)}
                className="recherche-pseudo"
              />
            </Col>
            <Col xs={12} md={4} lg={3}>
              <Form.Select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="recherche-niveau"
              >
                <option value="TOUS">Tous les niveaux</option>
                <option value="DEBUTANT">Débutant</option>
                <option value="INTERMEDIAIRE">Intermédiaire</option>
                <option value="AVANCE">Avancé</option>
                <option value="EXPERT">Expert</option>
              </Form.Select>
            </Col>
          </Row>
          {filteredUsers.length === 0 ? (
            <Alert variant="info" className="text-center">Aucun utilisateur ne correspond à vos critères</Alert>
          ) : (
            <Table striped bordered hover responsive className="liste-inscrits-table">
              <thead>
                <tr>
                  <th>Pseudo</th>
                  <th>Niveau</th>
                  {role === 'MODERATEUR' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="separateur pseudo-cell">{user.pseudo}</td>
                    <td>
                      <span className={`level-badge ${getLevelColorClass(user.niveau)}`}>
                        {user.niveau}
                      </span>
                    </td>
                    {role === 'MODERATEUR' && (
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Supprimer
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
}

export default ListeInscrits;
