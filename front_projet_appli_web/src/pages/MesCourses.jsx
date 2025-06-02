import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';

function MesCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8081/api/user/${userId}/courses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      });
  }, []);

  const now = new Date();

  const coursesAVenir = courses.filter(c => new Date(c.date) >= now);
  const coursesPassees = courses.filter(c => new Date(c.date) < now);

  function renderTable(coursesList) {
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: 8 }}>Nom</th>
            <th style={{ padding: 8 }}>Date</th>
            <th style={{ padding: 8 }}>Heure</th>
            <th style={{ padding: 8 }}>Lieu</th>
            <th style={{ padding: 8 }}>Description</th>
            <th style={{ padding: 8 }}>Organisateur</th>
            <th style={{ padding: 8 }}>Niveau</th>
            <th style={{ padding: 8 }}>Type</th>
          </tr>
        </thead>
        <tbody>
          {coursesList.map(course => (
            <tr key={course.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{course.nomEvent}</td>
              <td style={{ padding: 8 }}>{new Date(course.date).toLocaleDateString()}</td>
              <td style={{ padding: 8 }}>{course.debutHoraire}</td>
              <td style={{ padding: 8 }}>{course.lieu}</td>
              <td style={{ padding: 8 }}>{course.description}</td>
              <td style={{ padding: 8 }}>{course.nomOrganisateur}</td>
              <td style={{ padding: 8 }}>{course.niveau}</td>
              <td style={{ padding: 8 }}>{course.typeEvent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Navigation />
      <h2>Mes courses</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <h3>À venir</h3>
          {coursesAVenir.length === 0 ? <p>Aucune course à venir.</p> : renderTable(coursesAVenir)}
          <h3>Passées</h3>
          {coursesPassees.length === 0 ? <p>Aucune course passée.</p> : renderTable(coursesPassees)}
        </>
      )}
    </div>
  );
}

export default MesCourses;