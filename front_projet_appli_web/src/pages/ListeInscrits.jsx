import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

function ListeInscrits() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pseudoSearch, setPseudoSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('TOUS');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        console.log('TOKEN:', token, 'USERID:', userId);
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

    if (loading) return <p>Chargement en cours...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <div className="container">
            <style>
                {`
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                    }

                    .search-filter-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 15px;
                        margin-bottom: 30px;
                        justify-content: center;
                    }

                    .search-input,
                    .filter-select {
                        flex: 1 1 300px;
                        padding: 12px 20px;
                        font-size: 16px;
                        border-radius: 25px;
                        border: 1px solid #ccc;
                        outline: none;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        background-color: white;
                    }

                    .filter-select {
                        appearance: none;
                        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='70,100 110,40 30,40' fill='%23666'/%3E%3C/svg%3E");
                        background-repeat: no-repeat;
                        background-position: right 15px center;
                        background-size: 14px;
                        cursor: pointer;
                    }

                    .table-container {
                        overflow-x: auto;
                        border-radius: 10px;
                        box-shadow: 0 0 15px rgba(0,0,0,0.1);
                        background: white;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th, td {
                        padding: 15px;
                        text-align: left;
                    }

                    th {
                        background-color: #5da7db;
                        color: white;
                    }

                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }

                    .level-badge {
                        padding: 5px 12px;
                        border-radius: 15px;
                        color: white;
                        font-weight: 500;
                        font-size: 14px;
                        display: inline-block;
                    }

                    @media (max-width: 600px) {
                        .search-input,
                        .filter-select {
                            flex: 1 1 100%;
                        }
                    }
                `}
            </style>

            <Navigation />
            {currentUser && (
                <div style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '18px' }}>
                    Bonjour {currentUser.pseudo} !
                </div>
            )}
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Liste des inscrits</h2>

            <div className="search-filter-container">
                <input
                    type="text"
                    placeholder="Rechercher un pseudo..."
                    value={pseudoSearch}
                    onChange={(e) => setPseudoSearch(e.target.value)}
                    className="search-input"
                />
                <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="filter-select"
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
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Pseudo</th>
                                <th>Niveau</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user.pseudo}>
                                    <td>{user.pseudo}</td>
                                    <td>
                                        <span
                                            className="level-badge"
                                            style={{ backgroundColor: getLevelColor(user.niveau) }}
                                        >
                                            {user.niveau}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

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
