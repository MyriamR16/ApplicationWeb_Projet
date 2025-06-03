import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import { getLevelColor } from '../pages/ListeInscrits';

function MesCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8081/api/user/${userId}/courses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      });
  }, []);

  const now = new Date();
  const coursesAVenir = courses.filter(c => new Date(c.date) >= now);
  const coursesPassees = courses.filter(c => new Date(c.date) < now);

  function renderTable(coursesList) {
    return (
      <Table striped bordered hover responsive className="mb-4">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Lieu</th>
            <th>Description</th>
            <th>Organisateur</th>
            <th>Niveau</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {coursesList.map(course => (
            <tr key={course.id}>
              <td>{course.nomEvent}</td>
              <td>{new Date(course.date).toLocaleDateString()}</td>
              <td>{course.debutHoraire}</td>
              <td>{course.lieu}</td>
              <td>{course.description}</td>
              <td>{course.nomOrganisateur}</td>
              <td><span className="level-badge" style={{ backgroundColor: getLevelColor(course.niveau), color: '#1B2A32', fontWeight: 700 }}>{course.niveau}</span></td>
              <td>{course.typeEvent}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return (
    <>
      <Navigation />
      <div className="liste-courses-main-bg">
        <Container className="liste-courses-container">
          <h2 className="mb-4 text-center">Mes courses</h2>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </Spinner>
            </div>
          ) : (
            <>
              <h3 className="mt-4">À venir</h3>
              {coursesAVenir.length === 0 ? (
                <Alert variant="info" className="alert-compact">Aucune course à venir.</Alert>
              ) : (
                renderTable(coursesAVenir)
              )}
              <h3 className="mt-4">Passées</h3>
              {coursesPassees.length === 0 ? (
                <Alert variant="info" className="alert-compact">Aucune course passée.</Alert>
              ) : (
                renderTable(coursesPassees)
              )}
            </>
          )}
        </Container>
      </div>
    </>
  );
}

export default MesCourses;