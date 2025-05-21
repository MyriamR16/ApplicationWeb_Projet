import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

function ListeCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/event/')
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

    if (loading) return <p>Chargement en cours...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <div style={{ padding: '20px' }}>
        <Navigation />
        <h2>Liste des courses</h2>
        {courses.length === 0 ? (
            <p>Aucune course n'est enregistrée pour l'instant.</p>
        ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Nom</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Heure</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Lieu</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Organisateur</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Niveau</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Participants max</th>
                </tr>
                </thead>
                <tbody>
                {courses.map(course => (
                    <tr key={course.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{course.nomEvent || course.nom}</td>
                    <td style={{ padding: '8px' }}>{new Date(course.date).toLocaleDateString()}</td>
                    <td style={{ padding: '8px' }}>{course.debutHoraire || course.heure}</td>
                    <td style={{ padding: '8px' }}>{course.lieu}</td>
                    <td style={{ padding: '8px' }}>{course.description}</td>
                    <td style={{ padding: '8px' }}>{course.nomOrganisateur}</td>
                    <td style={{ padding: '8px' }}>{course.niveau}</td>
                    <td style={{ padding: '8px' }}>{course.typeEvent || course.type}</td>
                    <td style={{ padding: '8px' }}>{course.nombreParticipantsMax}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        )}
        </div>
    );
}

export default ListeCourses;
