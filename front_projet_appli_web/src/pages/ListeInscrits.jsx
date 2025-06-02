import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import './style/ListeInscrits.css'; 

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
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Utilisateur non trouvé');
          return res.json();
        })
        .then((data) => setCurrentUser(data))
        .catch((err) => console.error('Erreur chargement utilisateur:', err));
    }
    if (token) {
      fetch('http://localhost:8081/api/user/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Erreur lors du chargement');
          return res.json();
        })
        .then((data) => {
          setUsers(data);
          setFilteredUsers(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    let results = users;
    if (pseudoSearch) {
      results = results.filter((user) =>
        user.pseudo.toLowerCase().includes(pseudoSearch.toLowerCase())
      );
    }
    if (levelFilter !== 'TOUS') {
      results = results.filter((user) => user.niveau === levelFilter);
    }
    setFilteredUsers(results);
  }, [pseudoSearch, levelFilter, users]);

  function handleDeleteUser(userId) {
    const token = localStorage.getItem('token');
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    fetch(`http://localhost:8081/api/moderateur/personne/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la suppression');
        alert('Utilisateur supprimé !');
        setUsers(users.filter((u) => u.id !== userId));
      })
      .catch((err) => alert('Erreur : ' + err.message));
  }

  function getLevelColor(niveau) {
    switch (niveau?.toUpperCase()) {
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

  if (loading)
    return (
      <div className="centered">
        <p>Chargement en cours...</p>
      </div>
    );

  if (error)
    return (
      <div className="centered">
        <p>Erreur : {error}</p>
      </div>
    );

  return (
    <div className="container">
      <Navigation />
      <div className="tableContainer">
        {currentUser && (
          <div className="welcomeMessage">
            Bonjour {currentUser.pseudo} !
          </div>
        )}
        <h2 className="title">Liste des inscrits</h2>
        <div className="filterContainer">
          <input
            type="text"
            placeholder="Rechercher un pseudo..."
            value={pseudoSearch}
            onChange={(e) => setPseudoSearch(e.target.value)}
            className="input"
          />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="select"
          >
            <option value="TOUS">Tous les niveaux</option>
            <option value="DEBUTANT">Débutant</option>
            <option value="INTERMEDIAIRE">Intermédiaire</option>
            <option value="AVANCE">Avancé</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>
        {filteredUsers.length === 0 ? (
          <p className="noResults">Aucun utilisateur ne correspond à vos critères</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th className="th">Pseudo</th>
                <th className="th">Niveau</th>
                {role === 'MODERATEUR' && <th className="th">Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="td">{user.pseudo}</td>
                  <td className="td">
                    <span
                      className="levelBadge"
                      style={{ backgroundColor: getLevelColor(user.niveau) }}
                    >
                      {user.niveau}
                    </span>
                  </td>
                  {role === 'MODERATEUR' && (
                    <td className="td">
                      <button
                        className="deleteBtn"
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

export default ListeInscrits;
