import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function Navigation() {
  const [openMenu, setOpenMenu] = useState(null);
  const [userFromToken, setUserFromToken] = useState(null);
  const [userFromApi, setUserFromApi] = useState(null);

  const styles = {
    nav: {
      position: 'relative',
      zIndex: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      padding: '0.5vh 3vw', // moins d'espace en haut
      margin: '10px auto 20px auto',
      width: '90%',
      maxWidth: '1200px',
      display: 'flex',
      justifyContent: 'center',
    },
    ul: {
      listStyle: 'none',
      display: 'flex',
      gap: '2vw',
      margin: 0,
      padding: 0,
    },
    li: {
      position: 'relative',
      fontSize: '1.2vw', // texte plus petit
      fontWeight: '700',
      cursor: 'pointer',
      padding: '0.5vh 1vw',
      color: '#333',
      userSelect: 'none',
    },
    link: {
      color: '#333',
      textDecoration: 'none',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      padding: '10px',
      minWidth: '250px',
      zIndex: 10,
    },
    dropdownSection: {
      marginBottom: '10px',
    },
    dropdownTitle: {
      fontWeight: '700',
      borderBottom: '1px solid #ccc',
      marginBottom: '5px',
      fontSize: '1.1vw',
    },
    dropdownItem: {
      fontWeight: '400',
      fontSize: '0.9vw',
      marginLeft: '10px',
      padding: '2px 0',
      color: '#555',
    },
  };

  // Contenu du menu, format tableau pour simplicité
  const menuItems = [
    {
      label: "Accueil",
      link: "/accueil",
    },
    {
      label: "Événements",
      link: null,
      submenu: [
        { 
          title: null, 
          items: [
            <NavLink to="/listecourses" style={styles.dropdownItem}>Rechercher une course.</NavLink>,
            <NavLink to="/ajoutevent" style={styles.dropdownItem}>Créer un événement.</NavLink>
          ] 
        },
      ],
    },
    {
      label: "Communauté",
      link: null,
      submenu: [
        { title: null, 
          items: [
            "Liste des amis / groupes de running.",
            "Forum / discussions.", 
            <NavLink to="/listeinscrits" style={styles.dropdownItem}>Liste des inscrits</NavLink>,
            ] },
      ],
    },
    {
      label: "Défis",
      link: null,
      submenu: [
        { title: null, items: ["Défis hebdomadaires/mensuels.", "Classements."] },
      ],
    },
    {
      label: "Profil",
      link: "/profil"
    },
    {
      label: "Déconnexion",
      link: "/",
      onClick: () => {
        setUserFromToken(null);
        setUserFromApi(null);
        localStorage.removeItem('token');
        window.location.href = "/";
      }
    },
  ];

  function toggleMenu(index) {
    setOpenMenu(openMenu === index ? null : index);
  }

  return (
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        {menuItems.map((menu, i) => (
          <li
            key={menu.label}
            style={styles.li}
            onMouseEnter={() => setOpenMenu(i)}
            onMouseLeave={() => setOpenMenu(null)}
            onClick={() => toggleMenu(i)} // toggle au clic aussi
          >
            <NavLink
              to={menu.link}
              style={({ isActive }) => ({
                ...styles.link,
                fontWeight: isActive ? '900' : '700',
                textDecoration: isActive ? 'underline' : 'none',
              })}
              end={menu.link === "/"}
            >
              {menu.label}
            </NavLink>

            {openMenu === i && menu.submenu && (
              <div style={styles.dropdown}>
                {menu.submenu.map((section, si) => (
                  <div key={si} style={styles.dropdownSection}>
                    {section.title && <div style={styles.dropdownTitle}>{section.title}</div>}
                    {section.items.map((item, ii) => (
                      <div key={ii} style={styles.dropdownItem}>{item}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
