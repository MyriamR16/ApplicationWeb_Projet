import React from 'react'
import { Link } from 'react-router-dom'
function Index() {
  return (
    <>
      <h1>Authentification</h1>
      <div>
        <Link to="/connexion">
          <button type="button">Connexion</button>
        </Link>
      </div>
      <div>
        <Link to="/inscription">
          <button type="button">Inscription</button>
        </Link>
      </div>
    </>
  )
}
export default Index