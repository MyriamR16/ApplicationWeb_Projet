import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Card, ListGroup } from 'react-bootstrap';
import Navigation from "../components/Navigation";
import "./style/ListeGroupesAmis.css";

function ListeGroupesAmis() {
    const [groupesamis, setGroupesamis] = useState([]);
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

        fetch('http://localhost:8081/api/groupeamis/', {
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
                setGroupesamis(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    function handleDeleteGroupe(groupeId) {
        const token = localStorage.getItem('token');
        if (!window.confirm("Supprimer ce groupe ?")) return;
        fetch(`http://localhost:8081/api/groupeamis/${groupeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de la suppression");
                alert("Groupe supprimé !");
                setGroupesamis(groupesamis.filter(g => g.id !== groupeId));
            })
            .catch(err => alert("Erreur : " + err.message));
    }

    if (loading) return <div style={styles.centered}><p>Chargement en cours...</p></div>;
    if (error) return <div style={styles.centered}><p>Erreur : {error}</p></div>;

    function renderGroupe(groupe) {
        return (
            <ListGroup.Item key={groupe.id} className="groupe-amis-list-item d-flex justify-content-between align-items-center">
                <div>
                    <Link to={`/groupeamis/${groupe.id}`} className="groupe-amis-list-name">
                        {groupe.nom}
                    </Link>
                    <div className="groupe-amis-list-desc">{groupe.description}</div>
                </div>
                {role === "MODERATEUR" && (
                    <Button
                        className="groupe-amis-btn-supprimer"
                        onClick={() => handleDeleteGroupe(groupe.id)}
                    >
                        Supprimer
                    </Button>
                )}
            </ListGroup.Item>
        );
    }

    return (
        <div className="groupe-amis-list-page">
            <Navigation />
            <Container className="py-4 d-flex flex-column align-items-center">
                {user && (
                    <div className="groupe-amis-list-bonjour">
                        Bonjour {user.pseudo} !
                    </div>
                )}
                <h2 className="groupe-amis-list-title">Liste des groupes</h2>
                <Card className="groupe-amis-list-card">
                    <Card.Body>
                        {groupesamis.length === 0 ? (
                            <p className="groupe-amis-list-empty">Aucun groupe n'est enregistré pour l'instant.</p>
                        ) : (
                            <ListGroup variant="flush">
                                {groupesamis.map(groupe => renderGroupe(groupe))}
                            </ListGroup>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default ListeGroupesAmis;

const styles = {
    centered: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f7fa',
    },
};