import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Container, Table, Alert, Spinner } from 'react-bootstrap';
import './style/ListeCourses.css';
import '../pages/style/ListeInscrits.css';
import { getLevelColor } from '../pages/ListeInscrits';

function ListeCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const role = localStorage.getItem('role');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (userId && token) {
            fetch(`http://localhost:8081/api/user/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Utilisateur non trouvé');
                    return res.json();
                })
                .then(data => setUser(data))
                .catch(err => console.error('Erreur chargement utilisateur:', err));
        }

        fetch('http://localhost:8081/api/event/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
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

    function handleParticipate(courseId) {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8081/api/event/${courseId}/participer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId })
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de l'inscription");
                alert("Inscription réussie !");
                window.location.reload();
            })
            .catch(err => alert("Erreur : " + err.message));
    }

    function handleUnsubscribe(courseId) {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8081/api/event/${courseId}/desinscrire`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId })
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de la désinscription");
                alert("Désinscription réussie !");
                window.location.reload();
            })
            .catch(err => alert("Erreur : " + err.message));
    }

    function handleDeleteCourse(courseId) {
        const token = localStorage.getItem('token');
        if (!window.confirm("Supprimer cette course ?")) return;
        fetch(`http://localhost:8081/api/moderateur/event/${courseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de la suppression");
                alert("Course supprimée !");
                window.location.reload();
            })
            .catch(err => alert("Erreur : " + err.message));
    }

    return (
        <>
            <Navigation />
            <div className="liste-courses-main-bg">
                <Container className="liste-courses-container">
                    {user && (
                        <div className="text-center mb-3 fw-bold fs-5">Bonjour {user.pseudo} !</div>
                    )}
                    <h2 className="mb-4 text-center">Liste des courses</h2>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Chargement...</span>
                            </Spinner>
                        </div>
                    ) : error ? (
                        <Alert variant="danger">Erreur : {error}</Alert>
                    ) : courses.length === 0 ? (
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
                                    <th>Places restantes</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => {
                                    const placesRestantes = course.nombreParticipantsMax - (course.participants?.length || 0);
                                    const isInscrit = course.participants?.some(p => p.id === user?.id);

                                    return (
                                        <tr key={course.id}>
                                            <td>{course.nomEvent || course.nom}</td>
                                            <td>{new Date(course.date).toLocaleDateString()}</td>
                                            <td>{course.debutHoraire || course.heure}</td>
                                            <td>{course.lieu}</td>
                                            <td>{course.description}</td>
                                            <td>{course.nomOrganisateur}</td>
                                            <td><span className="level-badge" style={{ backgroundColor: getLevelColor(course.niveau), color: '#1B2A32', fontWeight: 700 }}>{course.niveau}</span></td>
                                            <td>{course.typeEvent || course.type}</td>
                                            <td>{placesRestantes}</td>
                                            <td>
                                                {role === "MODERATEUR" ? (
                                                    <button onClick={() => handleDeleteCourse(course.id)} className="btn btn-danger btn-sm">Supprimer</button>
                                                ) : isInscrit ? (
                                                    <button onClick={() => handleUnsubscribe(course.id)} className="btn btn-warning btn-sm">Se désinscrire</button>
                                                ) : placesRestantes > 0 ? (
                                                    <button onClick={() => handleParticipate(course.id)} className="btn btn-success btn-sm">Participer</button>
                                                ) : (
                                                    <button disabled className="btn btn-secondary btn-sm">Complet</button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}
                </Container>
            </div>
        </>
    );
}

export default ListeCourses;
