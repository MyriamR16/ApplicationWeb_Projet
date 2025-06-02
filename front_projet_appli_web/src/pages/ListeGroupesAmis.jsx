import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

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
            <li key={groupe.id} style={styles.groupItem}>
                <div>
                    <Link to={`/groupeamis/${groupe.id}`} style={styles.groupName}>
                        {groupe.nom}
                    </Link>
                    <div style={styles.groupDesc}>{groupe.description}</div>
                </div>
                {role === "MODERATEUR" && (
                    <button
                        onClick={() => handleDeleteGroupe(groupe.id)}
                        style={styles.deleteBtn}
                    >
                        Supprimer
                    </button>
                )}
            </li>
        );
    }

    return (
        <div style={styles.container}>
            <Navigation />
            {user && (
                <div style={{ marginBottom: 20, fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                    Bonjour {user.pseudo} !
                </div>
            )}
            <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Liste des groupes</h2>
            <div style={styles.listContainer}>
                {groupesamis.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>
                        Aucun groupe n'est enregistré pour l'instant.
                    </p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {groupesamis.map(groupe => renderGroupe(groupe))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ListeGroupesAmis;

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
    listContainer: {
        margin: '0 auto',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: 32,
        maxWidth: 700,
        width: '100%',
    },
    groupItem: {
        marginBottom: 18,
        background: '#f8fafd',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    groupName: {
        fontSize: 20,
        color: '#3498db',
        textDecoration: 'none',
        fontWeight: 600,
    },
    groupDesc: {
        color: '#555',
        fontSize: 15,
        marginTop: 4,
    },
    deleteBtn: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: 5,
        padding: '8px 16px',
        cursor: 'pointer',
        marginLeft: 16,
        fontWeight: 600,
        fontSize: 15,
        transition: "background 0.2s",
    }
};