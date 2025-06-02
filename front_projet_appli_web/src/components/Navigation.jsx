import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo-1.png";
import "../pages/style/Navigation.css";

function Navigation() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const userMenu = [
    { label: "Accueil", link: "/accueil" },
    {
      label: "Événements",
      submenu: [
        <NavLink to="/listecourses" key="listecourses">Rechercher une course</NavLink>,
        <NavLink to="/ajoutevent" key="ajoutevent">Créer un événement</NavLink>,
        <NavLink to="/mescourses" key="mescourses">Mes courses</NavLink>,
      ],
    },
    {
      label: "Groupes",
      submenu: [
        <NavLink to="/listegroupes" key="listegroupes">Voir les groupes</NavLink>,
        <NavLink to="/ajoutgroupe" key="ajoutgroupe">Créer un groupe</NavLink>,
      ],
    },
    {
      label: "Communauté",
      submenu: [
        <NavLink to="/discussions" key="discussions">Forums / Discussions</NavLink>,
      ],
    },
    {
      label: "Administration",
      submenu: [
        <NavLink to="/listeinscrits" key="listeinscrits">Liste des inscrits</NavLink>,
      ],
    },
    { label: "Profil", link: "/profil" },
    {
      label: "Paramètres",
      submenu: [
        <NavLink to="/mesinfos" key="mesinfos">Mes infos</NavLink>,
      ],
    },
    { label: "Déconnexion", link: "/connexion" },
  ];

  const moderateurMenu = [
    { label: "Accueil", link: "/accueil" },
    {
      label: "Modération",
      submenu: [
        <NavLink to="/listeinscrits" key="listeinscrits">Liste des inscrits</NavLink>,
        <NavLink to="/listecourses" key="listecourses">Liste des courses</NavLink>,
        <NavLink to="/listegroupes" key="listegroupes">Liste des groupes</NavLink>,
      ],
    },
    { label: "Profil", link: "/profil" },
    {
      label: "Paramètres",
      submenu: [
        <NavLink to="/mesinfos" key="mesinfos">Mes infos</NavLink>,
      ],
    },
    { label: "Déconnexion", link: "/connexion" },
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

  function handleBurgerClick(e) {
    e.stopPropagation();
    setMobileMenuOpen((prev) => !prev);
  }

  React.useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeMenu = () => setMobileMenuOpen(false);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [mobileMenuOpen]);

  return (
    <nav className="custom-navbar">
      <div className="navbar-header">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <button className="burger-menu" onClick={handleBurgerClick} aria-label="Ouvrir le menu" aria-expanded={mobileMenuOpen}>
          <span className="burger-bar"></span>
          <span className="burger-bar"></span>
          <span className="burger-bar"></span>
        </button>
      </div>
      <ul className={`navigation-menu${mobileMenuOpen ? ' open' : ''}`}>
        {menuItems.map((menu, i) => (
          <li
            key={menu.label}
            className={menu.submenu ? "nav-item dropdown navigation-item" : "nav-item navigation-item"}
            onMouseEnter={() => setOpenMenu(i)}
            onMouseLeave={() => setOpenMenu(null)}
            onClick={() => toggleMenu(i)}
            style={{ position: 'relative' }}
          >
            {menu.label === "Déconnexion" ? (
              <a href="/connexion" className="nav-link" onClick={handleLogout}>
                {menu.label}
              </a>
            ) : menu.link ? (
              <NavLink
                to={menu.link}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                end={menu.link === "/"}
              >
                {menu.label}
              </NavLink>
            ) : (
              <span className="dropdown-toggle nav-link" role="button" aria-haspopup="true" aria-expanded={openMenu === i}>
                {menu.label}
              </span>
            )}

            {openMenu === i && menu.submenu && (
              <div className="dropdown-menu show" style={{ display: 'block', position: 'absolute', top: '100%', left: 0 }}>
                {menu.submenu.map((item, ii) => (
                  <div key={ii} className="dropdown-item">
                    {item}
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