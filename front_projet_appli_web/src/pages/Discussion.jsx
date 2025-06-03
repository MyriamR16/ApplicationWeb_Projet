import React, { useEffect, useState, useRef } from 'react';
import Navigation from '../components/Navigation';
import { useParams } from 'react-router-dom';
import '../pages/style/Discussion.css';

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
    <div className="discussion-container">
      <Navigation />
      <div className="discussion-box">
        <div className="discussion-header">
          {discussion.groupeAmis && discussion.groupeAmis.nom
            ? discussion.groupeAmis.nom
            : "Discussion"}
        </div>

        <div className="discussion-messages">
          {messages.map((msg, i) => {
            const isMine = user && msg.auteur && msg.auteur.id === user.id;
            return (
              <div key={i} className={`message-row${isMine ? ' mine' : ''}`}> 
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(msg.auteur?.pseudo || msg.auteur?.id || 'user')}`}
                  alt="Avatar"
                  className="avatar"
                />
                <div className="message-bubble">
                  <div className="message-author">
                    {msg.auteur ? msg.auteur.pseudo : 'Utilisateur'}
                  </div>
                  <div>{msg.contenu}</div>
                  <div className="message-date">
                    {msg.dateEnvoi ? new Date(msg.dateEnvoi).toLocaleString() : ''}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="discussion-form">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Écrire un message..."
            className="discussion-input"
          />
          <button type="submit" className="discussion-send-btn">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}

export default Discussion;