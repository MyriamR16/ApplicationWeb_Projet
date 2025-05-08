import React from "react";
import { NavLink } from "react-router-dom";

function Navigation() {
    return (
      <div className="navigation">
        <ul>
            <NavLink to="/">
                <li>Index</li>
            </NavLink>
            <NavLink to="/accueil">
                <li>Accueil</li>
            </NavLink>
            <NavLink to="/ajoutevent">
                <li>Créer un Evenement</li>
            </NavLink>
        </ul>
      </div>
    )
  }

export default Navigation;