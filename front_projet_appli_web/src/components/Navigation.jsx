import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navigation() {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // "USER", "MODERATEUR", ou "MODERATEUR_COUREUR" selon ton backend

  const styles = {
    nav: {
      position: 'relative',
      zIndex: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      padding: '0.5vh 3vw',
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
      fontSize: '1.2vw',
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

  // Construction dynamique du menu selon le rôle
  const menuItems = [
    {
      label: "Accueil",
      link: "/accueil",
    },
    // Pages classiques pour coureur ou modérateur-coureur
    ...(role === "USER" || role === "MODERATEUR_COUREUR" || role === "MODERATEUR" ? [
      {
        label: "Événements",
        link: null,
        submenu: [
          {
            title: null,
            items: [
              <NavLink to="/listecourses" style={styles.dropdownItem}>Rechercher une course.</NavLink>,
              <NavLink to="/ajoutevent" style={styles.dropdownItem}>Créer un événement.</NavLink>,
              (role === "USER" || role === "MODERATEUR_COUREUR") && <NavLink to="/mescourses" style={styles.dropdownItem}>Mes courses</NavLink>
            ].filter(Boolean)
          },
        ],
      }
    ] : []),
    // Pages de modération pour modérateur ou modérateur-coureur
    ...(role === "MODERATEUR" || role === "MODERATEUR_COUREUR" ? [
      {
        label: "Modération",
        link: null,
        submenu: [
          {
            title: null,
            items: [
              <NavLink to="/listeinscrits" style={styles.dropdownItem}>Liste des inscrits</NavLink>,
              <NavLink to="/listecourses" style={styles.dropdownItem}>Liste des courses</NavLink>
            ]
          }
        ]
      }
    ] : []),
    {
      label: "Profil",
      link: "/profil"
    },
    {
      label: "Paramètres",
      link: null,
      submenu: [
        {
          title: null,
          items: [
            <NavLink to="/mesinfos" style={styles.dropdownItem}>Mes infos</NavLink>
          ]
        }
      ]
    },
    {
      label: "Déconnexion",
      link: "/connexion"
    },
  ];

  function handleLogout(e) {
    e.preventDefault();
    localStorage.clear();
    navigate("/connexion");
  }

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
            onClick={() => toggleMenu(i)}
          >
            {menu.label === "Déconnexion" ? (
              <a
                href="/connexion"
                style={styles.link}
                onClick={handleLogout}
              >
                {menu.label}
              </a>
            ) : (
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
            )}

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