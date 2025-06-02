import React, { useEffect, useState, useRef } from 'react';
import Navigation from '../components/Navigation';
import { useParams } from 'react-router-dom';

function Discussion() {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

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
        .then(res => {
          if (!res.ok) throw new Error('Utilisateur non trouvé ou non autorisé');
          return res.json();
        })
        .then(data => setUser(data))
        .catch(() => {
          setUser(null);
          window.location.href = '/connexion';
        });
    } else {
      setUser(null);
      window.location.href = '/connexion';
    }

    // Forcer le rafraîchissement du titre de la discussion après modification
    const fetchDiscussion = () => {
      fetch(`http://localhost:8081/api/discussion/groupeamis/${id}?t=${Date.now()}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => {
          if (res.status === 403) throw new Error('Accès refusé à la discussion (403)');
          return res.json();
        })
        .then(data => {
          setDiscussion(data);
          setMessages(data.messages || []);
        })
        .catch(err => {
          setDiscussion(null);
          setMessages([]);
          setError(err.message);
        });
    };

    fetchDiscussion();

    // Ajoute un event listener pour détecter le retour sur la page (ex: après modif du groupe)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchDiscussion();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || !user) return;
    fetch(`http://localhost:8081/api/message/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        contenu: input,
        auteur: { id: user.id },
        discussion: { id: discussion.id }
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de l'envoi du message");
        return res.json();
      })
      .then(msg => {
        setMessages([...messages, msg]);
        setInput("");
      })
      .catch(err => {
        alert(err.message);
      });
  }

  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>Erreur : {error}</div>;
  if (!discussion) return <div>Chargement de la discussion...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      <Navigation />
      <div style={{
        maxWidth: 700,
        margin: '30px auto',
        background: '#ffffff',
        borderRadius: 20,
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '80vh',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#4A90E2',
          color: 'white',
          padding: '20px 24px',
          fontSize: 22,
          fontWeight: 'bold',
          borderRadius: '20px 20px 0 0'
        }}>
          {discussion.groupeAmis && discussion.groupeAmis.nom
            ? discussion.groupeAmis.nom
            : "Discussion"}
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          background: '#f4f6f9'
        }}>
          {messages.map((msg, i) => {
            const isMine = user && msg.auteur && msg.auteur.id === user.id;
            return (
              <div key={i} style={{
                display: 'flex',
                flexDirection: isMine ? 'row-reverse' : 'row',
                marginBottom: 16,
                alignItems: 'flex-end'
              }}>
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(msg.auteur?.pseudo || msg.auteur?.id || 'user')}`}
                  alt="Avatar"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    margin: isMine ? '0 0 0 10px' : '0 10px 0 0',
                    background: '#eee',
                    border: '2px solid #4A90E2'
                  }}
                />
                <div style={{
                  background: isMine ? '#d1e7dd' : '#ffffff',
                  color: '#333',
                  borderRadius: 16,
                  padding: '12px 16px',
                  maxWidth: '75%',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  fontSize: 15
                }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#4A90E2', marginBottom: 4 }}>
                    {msg.auteur ? msg.auteur.pseudo : 'Utilisateur'}
                  </div>
                  <div>{msg.contenu}</div>
                  <div style={{
                    fontSize: 11,
                    color: '#aaa',
                    marginTop: 6,
                    textAlign: 'right'
                  }}>
                    {msg.dateEnvoi ? new Date(msg.dateEnvoi).toLocaleString() : ''}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} style={{
          display: 'flex',
          borderTop: '1px solid #e0e0e0',
          padding: '12px 16px',
          background: '#fff',
          borderRadius: '0 0 20px 20px'
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Écrire un message..."
            style={{
              flex: 1,
              border: '1px solid #ddd',
              borderRadius: 10,
              padding: '12px 16px',
              fontSize: 16,
              outline: 'none',
              marginRight: 12
            }}
          />
          <button type="submit" style={{
            background: '#4A90E2',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            padding: '12px 20px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer'
          }}>
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}

export default Discussion;