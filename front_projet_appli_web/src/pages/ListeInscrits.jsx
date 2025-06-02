import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './style/ListeInscrits.css'; 

function ListeInscrits() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pseudoSearch, setPseudoSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('TOUS');

    useEffect(() => {
        fetch('http://localhost:8081/api/user/list')
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
            <Navigation />
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