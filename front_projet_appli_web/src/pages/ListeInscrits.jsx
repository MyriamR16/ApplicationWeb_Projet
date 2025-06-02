<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './style/ListeInscrits.css'; 
=======
import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
>>>>>>> main

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
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Utilisateur non trouvé');
                    return res.json();
                })
                .then(data => setCurrentUser(data))
                .catch(err => console.error('Erreur chargement utilisateur:', err));
        }
        if (token) {
            fetch('http://localhost:8081/api/user/list', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Erreur lors du chargement');
                    return res.json();
                })
                .then(data => {
                    setUsers(data);
                    setFilteredUsers(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, []);

    useEffect(() => {
        let results = users;
        if (pseudoSearch) {
            results = results.filter(user =>
                user.pseudo.toLowerCase().includes(pseudoSearch.toLowerCase())
            );
        }
        if (levelFilter !== 'TOUS') {
            results = results.filter(user =>
                user.niveau === levelFilter
            );
        }
        setFilteredUsers(results);
    }, [pseudoSearch, levelFilter, users]);

    function handleDeleteUser(userId) {
        const token = localStorage.getItem('token');
        if (!window.confirm("Supprimer cet utilisateur ?")) return;
        fetch(`http://localhost:8081/api/moderateur/personne/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de la suppression");
                alert("Utilisateur supprimé !");
                setUsers(users.filter(u => u.id !== userId));
            })
            .catch(err => alert("Erreur : " + err.message));
    }

    if (loading) return <div style={styles.centered}><p>Chargement en cours...</p></div>;
    if (error) return <div style={styles.centered}><p>Erreur : {error}</p></div>;

    function getLevelColor(niveau) {
        switch (niveau?.toUpperCase()) {
            case 'DEBUTANT': return '#4CAF50';
            case 'INTERMEDIAIRE': return '#2196F3';
            case 'AVANCE': return '#9C27B0';
            case 'EXPERT': return '#F44336';
            default: return '#607D8B';
        }
    }

    return (
<<<<<<< HEAD
        <div className="container">
=======
        <div style={styles.container}>
>>>>>>> main
            <Navigation />
            <div style={styles.tableContainer}>
                {currentUser && (
                    <div style={{ marginBottom: 20, fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                        Bonjour {currentUser.pseudo} !
                    </div>
                )}
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Liste des inscrits</h2>
                <div style={styles.filterContainer}>
                    <input
                        type="text"
                        placeholder="Rechercher un pseudo..."
                        value={pseudoSearch}
                        onChange={(e) => setPseudoSearch(e.target.value)}
                        style={styles.input}
                    />
                    <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        style={styles.select}
                    >
                        <option value="TOUS">Tous les niveaux</option>
                        <option value="DEBUTANT">Débutant</option>
                        <option value="INTERMEDIAIRE">Intermédiaire</option>
                        <option value="AVANCE">Avancé</option>
                        <option value="EXPERT">Expert</option>
                    </select>
                </div>
                {filteredUsers.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>
                        Aucun utilisateur ne correspond à vos critères
                    </p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Pseudo</th>
                                <th style={styles.th}>Niveau</th>
                                {role === "MODERATEUR" && <th style={styles.th}>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td style={styles.td}>{user.pseudo}</td>
                                    <td style={styles.td}>
                                        <span
                                            style={{ ...styles.levelBadge, backgroundColor: getLevelColor(user.niveau) }}
                                        >
                                            {user.niveau}
                                        </span>
                                    </td>
                                    {role === "MODERATEUR" && (
                                        <td style={styles.td}>
                                            <button
                                                style={styles.deleteBtn}
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

<<<<<<< HEAD
function getLevelColor(niveau) {
    switch (niveau.toUpperCase()) {
        case 'DEBUTANT':
            return '#4CAF50';
        case 'INTERMEDIAIRE':
            return '#2196F3';
        case 'AVANCE':
            return '#9C27B0';
        case 'EXPERT':
            return '#F44336';
        default:
            return '#607D8B';
    }
}

export default ListeInscrits;
=======
export default ListeInscrits;

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
    maxWidth: 700,
    width: '100%',
  },
  filterContainer: {
    display: 'flex',
    gap: 16,
    marginBottom: 24,
    justifyContent: 'center',
  },
  input: {
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 15,
    width: 180,
  },
  select: {
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 15,
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
  levelBadge: {
    padding: '4px 10px',
    borderRadius: 8,
    color: 'white',
    fontWeight: 600,
    fontSize: 13,
    display: 'inline-block',
    minWidth: 70,
    textAlign: 'center',
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
};
>>>>>>> main
