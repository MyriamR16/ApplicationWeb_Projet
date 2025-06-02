import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navigation() {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const styles = {
    nav: {
      position: 'relative',
      zIndex: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      padding: '0.5vh 3vw',
      margin: '10px auto 20px auto',
      width: '100%',
      maxWidth: '1200px',
      minWidth: 0,
      boxSizing: 'border-box',
      overflowX: 'auto',
    },
    ul: {
      listStyle: 'none',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2vw',
      margin: 0,
      padding: 0,
      minWidth: 0,
      boxSizing: 'border-box',
      justifyContent: 'center',
    },
    li: {
      position: 'relative',
      fontSize: '1.2vw',
      fontWeight: '700',
      cursor: 'pointer',
      padding: '0.5vh 1vw',
      color: '#333',
      userSelect: 'none',
      whiteSpace: 'nowrap',
    },
    link: {
      color: '#333',
      textDecoration: 'none',
      display: 'inline-block',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      padding: '10px',
      minWidth: '200px',
      zIndex: 10,
    },
    dropdownItem: {
      fontWeight: '400',
      fontSize: '0.9vw',
      marginLeft: '10px',
      padding: '2px 0',
      color: '#555',
      whiteSpace: 'nowrap',
    },
  };

  // USER : accès à tout, "Liste des inscrits" dans "Administration"
  const userMenu = [
    { label: "Accueil", link: "/accueil" },
    {
      label: "Événements",
      submenu: [
        <NavLink to="/listecourses" style={styles.dropdownItem}>Rechercher une course</NavLink>,
        <NavLink to="/ajoutevent" style={styles.dropdownItem}>Créer un événement</NavLink>,
        <NavLink to="/mescourses" style={styles.dropdownItem}>Mes courses</NavLink>
      ]
    },
    {
      label: "Groupes",
      submenu: [
        <NavLink to="/listegroupes" style={styles.dropdownItem}>Voir les groupes</NavLink>,
        <NavLink to="/ajoutgroupe" style={styles.dropdownItem}>Créer un groupe</NavLink>
      ]
    },
    {
      label: "Communauté",
      submenu: [
        <NavLink to="/discussions" style={styles.dropdownItem}>Forums / Discussions</NavLink>
      ]
    },
    {
      label: "Administration",
      submenu: [
        <NavLink to="/listeinscrits" style={styles.dropdownItem}>Liste des inscrits</NavLink>
      ]
    },
    { label: "Profil", link: "/profil" },
    {
      label: "Paramètres",
      submenu: [
        <NavLink to="/mesinfos" style={styles.dropdownItem}>Mes infos</NavLink>
      ]
    },
    { label: "Déconnexion", link: "/connexion" }
  ];

  // MODERATEUR : accès uniquement à la modération et profil
  const moderateurMenu = [
    { label: "Accueil", link: "/accueil" },
    {
      label: "Modération",
      submenu: [
        <NavLink to="/listeinscrits" style={styles.dropdownItem}>Liste des inscrits</NavLink>,
        <NavLink to="/listecourses" style={styles.dropdownItem}>Liste des courses</NavLink>,
        <NavLink to="/listegroupes" style={styles.dropdownItem}>Liste des groupes</NavLink>
      ]
    },
    { label: "Profil", link: "/profil" },
    {
      label: "Paramètres",
      submenu: [
        <NavLink to="/mesinfos" style={styles.dropdownItem}>Mes infos</NavLink>
      ]
    },
    { label: "Déconnexion", link: "/connexion" }
  ];

  const menuItems = role === "MODERATEUR" ? moderateurMenu : userMenu;

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
            ) : menu.link ? (
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
            ) : (
              <span style={styles.link}>{menu.label}</span>
            )}

            {openMenu === i && menu.submenu && (
              <div style={styles.dropdown}>
                {menu.submenu.map((item, ii) => (
                  <div key={ii} style={styles.dropdownItem}>{item}</div>
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