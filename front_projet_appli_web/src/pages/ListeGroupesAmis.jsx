import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';

function ListeGroupesAmis() {
    const [groupesamis, setGroupesamis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

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

    const handleRetirerMembre = (groupeId) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8081/api/groupeamis/${groupeId}/retirerMembre`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId })
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors du retrait du groupe");
                // Optionnel : afficher un message de succès
                // alert("Vous avez quitté le groupe !");
                // Rafraîchir la liste
                setGroupesamis(prev => prev.map(g => g.id === groupeId ? { ...g, membres: g.membres.filter(m => m.id !== Number(userId)) } : g));
            })
            .catch(err => {
                alert("Erreur : " + err.message);
            });
    };

    const handleAjouterMembre = (groupeId) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8081/api/groupeamis/${groupeId}/ajouterMembre`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId })
        })
            .then(res => {
                if (!res.ok) throw new Error("Erreur lors de l'ajout au groupe");
                // alert("Vous êtes membre du groupe !");
                setGroupesamis(prev => prev.map(g => g.id === groupeId ? { ...g, membres: [...g.membres, { id: Number(userId), pseudo: user.pseudo }] } : g));
            })
            .catch(err => {
                alert("Erreur : " + err.message);
            });
    };

    if (loading) return <p>Chargement en cours...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            <Navigation />
            {user && (
                <div style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '18px' }}>
                    Bonjour {user.pseudo} !
                </div>
            )}
            <h2>Liste des groupes</h2>
            {groupesamis.length === 0 ? (
                <p>Aucun groupe n'est enregistré pour l'instant.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {(() => {
                        if (!user) return groupesamis.map(groupe => renderGroupe(groupe, false));
                        // Séparer membres et non-membres
                        const membres = groupesamis.filter(groupe => groupe.membres && groupe.membres.some(m => m.id === user.id));
                        const nonMembres = groupesamis.filter(groupe => !groupe.membres || !groupe.membres.some(m => m.id === user.id));
                        return [...membres, ...nonMembres].map(groupe => renderGroupe(groupe, membres.includes(groupe)));
                    })()}
                </ul>
            )}
        </div>
    );

    function renderGroupe(groupe, isMembre) {
        return (
            <li key={groupe.id} style={{ marginBottom: '18px', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <Link to={`/groupeamis/${groupe.id}`} style={{ fontSize: 20, color: '#3498db', textDecoration: 'none', fontWeight: 600 }}>
                        {groupe.nom}
                    </Link>
                    <div style={{ color: '#555', fontSize: 15, marginTop: 4 }}>{groupe.description}</div>
                </div>
                {user && (
                    isMembre ? (
                        <button
                            onClick={() => handleRetirerMembre(groupe.id)}
                            style={{
                                backgroundColor: '#f39c12',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                marginLeft: 16
                            }}
                        >
                            Quitter le groupe
                        </button>
                    ) : (
                        <button
                            onClick={() => handleAjouterMembre(groupe.id)}
                            style={{
                                backgroundColor: '#27ae60',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                marginLeft: 16
                            }}
                        >
                            Rejoindre le groupe
                        </button>
                    )
                )}
            </li>
        );
    }
}
export default ListeGroupesAmis;