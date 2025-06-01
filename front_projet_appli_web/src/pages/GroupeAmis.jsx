import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { useParams } from 'react-router-dom';

function GroupeAmis() {
  const { id } = useParams();
  const [groupe, setGroupe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editNom, setEditNom] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAdminId, setEditAdminId] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (userId && token) {
      fetch(`http://localhost:8081/api/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setUser(data));
    }
    fetch(`http://localhost:8081/api/groupeamis/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement du groupe');
        return res.json();
      })
      .then(data => {
        setGroupe(data);
        setEditNom(data.nom);
        setEditDescription(data.description);
        setEditAdminId(data.admin ? data.admin.id : "");
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  function handleEditSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    // Met à jour le groupe
    fetch(`http://localhost:8081/api/groupeamis/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nom: editNom,
        description: editDescription,
        admin: { id: Number(editAdminId) }
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la modification');
        // On recharge le groupe pour avoir le nouvel admin à jour
        return fetch(`http://localhost:8081/api/groupeamis/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      })
      .then(res => res.json())
      .then(data => {
        setGroupe(data);
        setEditMode(false);
        // Met à jour le titre de la discussion associée si besoin
        if (editNom && data.discussion && data.discussion.id) {
          fetch(`http://localhost:8081/api/discussion/${data.discussion.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              id: data.discussion.id,
              titre: editNom,
              groupeAmis: { id: data.id }
            })
          })
          .then(res => {
            if (!res.ok) throw new Error('Erreur lors de la mise à jour du titre de la discussion');
            // Pas besoin de setState ici, la synchro se fait au prochain chargement
          })
          .catch(err => alert(err.message));
        }
      })
      .catch(err => alert(err.message));
  }

  function handleDeleteGroupe() {
    if(window.confirm('Voulez-vous vraiment supprimer ce groupe ? Cette action est irréversible.')) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:8081/api/groupeamis/${groupe.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Erreur lors de la suppression du groupe');
          window.location.href = '/listegroupes';
        })
        .catch(err => alert(err.message));
    }
  }

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!groupe) return <div>Groupe introuvable</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navigation />
      <div style={{ maxWidth: 700, margin: '30px auto', background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: 32 }}>
        {user && groupe.admin && user.id === groupe.admin.id && !editMode && (
          <div style={{display:'flex', gap: '10px', marginBottom:20}}>
            <button onClick={() => setEditMode(true)} style={{ background:'#3498db', color:'white', border:'none', borderRadius:6, padding:'8px 18px', fontWeight:600, cursor:'pointer'}}>Modifier le groupe</button>
            <button onClick={handleDeleteGroupe} style={{ background:'#e74c3c', color:'white', border:'none', borderRadius:6, padding:'8px 18px', fontWeight:600, cursor:'pointer'}}>Supprimer le groupe</button>
          </div>
        )}
        {editMode ? (
          <form onSubmit={handleEditSubmit} style={{marginBottom:20}}>
            <div style={{marginBottom:10}}>
              <label>Nom du groupe : </label>
              <input value={editNom} onChange={e => setEditNom(e.target.value)} style={{padding:6, borderRadius:4, border:'1px solid #ccc', width:'100%'}} required />
            </div>
            <div style={{marginBottom:10}}>
              <label>Description : </label>
              <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} style={{padding:6, borderRadius:4, border:'1px solid #ccc', width:'100%'}} rows={3} />
            </div>
            <div style={{marginBottom:10}}>
              <label>Admin du groupe : </label>
              <select value={editAdminId} onChange={e => setEditAdminId(e.target.value)} style={{padding:6, borderRadius:4, border:'1px solid #ccc', width:'100%'}} required>
                {groupe.membres && groupe.membres.map(m => (
                  <option key={m.id} value={m.id}>{m.pseudo}</option>
                ))}
              </select>
            </div>
            <button type="submit" style={{background:'#27ae60', color:'white', border:'none', borderRadius:6, padding:'8px 18px', fontWeight:600, cursor:'pointer', marginRight:10}}>Enregistrer</button>
            <button type="button" onClick={() => setEditMode(false)} style={{background:'#e74c3c', color:'white', border:'none', borderRadius:6, padding:'8px 18px', fontWeight:600, cursor:'pointer'}}>Annuler</button>
          </form>
        ) : null}
        <h1 style={{ color: '#2c3e50', fontSize: 28, fontWeight: 600, marginBottom: 20 }}>{groupe.nom || <span style={{color:'red'}}>Nom manquant</span>}</h1>
        <p style={{ fontSize: 18, color: '#555', marginBottom: 20 }}>{groupe.description || <span style={{color:'red'}}>Description manquante</span>}</p>
        <div style={{ marginBottom: 20 }}>
          <strong>Admin :</strong> {groupe.admin ? groupe.admin.pseudo : <span style={{color:'red'}}>Non défini</span>}
        </div>
        <div>
          <strong>Membres du groupe :</strong>
          <ul style={{ marginTop: 10 }}>
            {groupe.membres && groupe.membres.length > 0 ? (
              groupe.membres.map(membre => (
                <li key={membre.id} style={{ fontSize: 16, marginBottom: 6 }}>
                  {membre.pseudo} {groupe.admin && membre.id === groupe.admin.id && <span title="Admin" style={{color:'#f1c40f', fontSize:18, marginLeft:6}}>★</span>}
                </li>
              ))
            ) : (
              <li>Aucun membre pour l'instant.</li>
            )}
          </ul>
        </div>
        <div style={{marginTop: 30, textAlign: 'center'}}>
          <a href={`/discussion/${groupe.id}`} style={{
            display: 'inline-block',
            background: '#25D366',
            color: 'white',
            padding: '12px 28px',
            borderRadius: '30px',
            fontWeight: 600,
            fontSize: 18,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            marginTop: 10
          }}>
            💬 Discussion du groupe
          </a>
        </div>
      </div>
    </div>
  );
}

export default GroupeAmis;
