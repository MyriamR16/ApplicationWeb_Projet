import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

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

    if (loading) return <div style={styles.centered}><p>Chargement en cours...</p></div>;
    if (error) return <div style={styles.centered}><p>Erreur : {error}</p></div>;

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
            .catch(err => {
                alert("Erreur : " + err.message);
            });
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
            .catch(err => {
                alert("Erreur : " + err.message);
            });
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
        <div style={styles.container}>
            <Navigation />
            {user && (
                <div style={{ marginBottom: 20, fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                    Bonjour {user.pseudo} !
                </div>
            )}
            <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Liste des courses</h2>
            <div style={styles.tableContainer}>
                {courses.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>
                        Aucune course n'est enregistrée pour l'instant.
                    </p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Nom</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Heure</th>
                                <th style={styles.th}>Lieu</th>
                                <th style={styles.th}>Description</th>
                                <th style={styles.th}>Organisateur</th>
                                <th style={styles.th}>Niveau</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Places restantes</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => {
                                const placesRestantes = course.nombreParticipantsMax - (course.participants ? course.participants.length : 0);
                                const isInscrit = course.participants && user && course.participants.some(p => p.id === user.id);

                                return (
                                    <tr key={course.id}>
                                        <td style={styles.td}>{course.nomEvent || course.nom}</td>
                                        <td style={styles.td}>{new Date(course.date).toLocaleDateString()}</td>
                                        <td style={styles.td}>{course.debutHoraire || course.heure}</td>
                                        <td style={styles.td}>{course.lieu}</td>
                                        <td style={styles.td}>{course.description}</td>
                                        <td style={styles.td}>{course.nomOrganisateur}</td>
                                        <td style={styles.td}>{course.niveau}</td>
                                        <td style={styles.td}>{course.typeEvent || course.type}</td>
                                        <td style={styles.td}>{placesRestantes}</td>
                                        <td style={styles.td}>
                                            {role === "MODERATEUR" ? (
                                                <button
                                                    onClick={() => handleDeleteCourse(course.id)}
                                                    style={styles.deleteBtn}
                                                >
                                                    Supprimer
                                                </button>
                                            ) : (
                                                isInscrit ? (
                                                    <button
                                                        onClick={() => handleUnsubscribe(course.id)}
                                                        style={styles.unsubscribeBtn}
                                                    >
                                                        Se désinscrire
                                                    </button>
                                                ) : (
                                                    placesRestantes > 0 ? (
                                                        <button
                                                            onClick={() => handleParticipate(course.id)}
                                                            style={styles.participateBtn}
                                                        >
                                                            Participer
                                                        </button>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            style={styles.fullBtn}
                                                        >
                                                            Complet
                                                        </button>
                                                    )
                                                )
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ListeCourses;

const styles = {
    container: {
        minHeight: '100vh',
        background: '#f5f7fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 40,
    },
    centered: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f7fa',
    },
    tableContainer: {
        margin: '0 auto',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: 32,
        maxWidth: 1100,
        width: '100%',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: 30,
    },
    th: {
        textAlign: 'left',
        padding: '12px 8px',
        background: '#f0f4f8',
        fontWeight: 700,
        fontSize: 16,
    },
    td: {
        padding: '10px 8px',
        fontSize: 15,
        borderBottom: '1px solid #eee',
    },
    deleteBtn: {
        background: "#e74c3c",
        color: "white",
        border: "none",
        borderRadius: 6,
        padding: "6px 12px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 15,
        transition: "background 0.2s",
    },
    participateBtn: {
        background: "#3498db",
        color: "white",
        border: "none",
        borderRadius: 6,
        padding: "6px 12px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 15,
        transition: "background 0.2s",
    },
    unsubscribeBtn: {
        background: "#f39c12",
        color: "white",
        border: "none",
        borderRadius: 6,
        padding: "6px 12px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 15,
        transition: "background 0.2s",
    },
    fullBtn: {
        background: "#e74c3c",
        color: "white",
        border: "none",
        borderRadius: 6,
        padding: "6px 12px",
        fontWeight: 600,
        fontSize: 15,
        cursor: "not-allowed",
        opacity: 0.7,
    },
};