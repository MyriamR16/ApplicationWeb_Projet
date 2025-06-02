import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Container, Table, Alert, Spinner } from 'react-bootstrap';
import './style/ListeCourses.css'; 

function ListeCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8081/api/event/')
        .then(res => {
            if (!res.ok) throw new Error('Erreur lors du chargement');
            return res.json();
        })
        .then(data => {
            setCourses(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    }, []);

    return (
        <>
            <Navigation />
            <div className="liste-courses-main-bg">
                <Container className="liste-courses-container">
                    <h2 className="mb-4">Liste des courses</h2>
                    {loading && (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Chargement...</span>
                            </Spinner>
                        </div>
                    )}
                    {error && <Alert variant="danger">Erreur : {error}</Alert>}
                    {!loading && !error && (
                        courses.length === 0 ? (
                            <Alert variant="info">Aucune course n'est enregistrée pour l'instant.</Alert>
                        ) : (
                            <Table className="liste-courses-table">
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
                                        <th>Participants max</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => (
                                        <tr key={course.id}>
                                            <td>{course.nomEvent || course.nom}</td>
                                            <td>{new Date(course.date).toLocaleDateString()}</td>
                                            <td>{course.debutHoraire || course.heure}</td>
                                            <td>{course.lieu}</td>
                                            <td>{course.description}</td>
                                            <td>{course.nomOrganisateur}</td>
                                            <td>{course.niveau}</td>
                                            <td>{course.typeEvent || course.type}</td>
                                            <td>{course.nombreParticipantsMax}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )
                    )}
                </Container>
            </div>
        </>
    );
}

export default ListeCourses;