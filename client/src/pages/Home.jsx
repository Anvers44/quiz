// client/src/pages/Home.jsx
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home-container">
            <h1>Bienvenue sur le Projet MERN 2025</h1>
            <p>Une application moderne avec MongoDB, Express, React et Node.js</p>

            <div className="features">
                <div className="feature">
                    <h3>Authentification Sécurisée</h3>
                    <p>Système complet avec JWT et protection des routes</p>
                </div>
                <div className="feature">
                    <h3>Communication en Temps Réel</h3>
                    <p>Grâce à Socket.io pour une expérience interactive</p>
                </div>
                <div className="feature">
                    <h3>Interface Moderne</h3>
                    <p>Construite avec React et Vite pour des performances optimales</p>
                </div>
            </div>

            {!isAuthenticated ? (
                <div className="cta-buttons">
                    <Link to="/register" className="btn btn-primary">S'inscrire</Link>
                    <Link to="/login" className="btn btn-secondary">Se connecter</Link>
                </div>
            ) : (
                <div className="cta-buttons">
                    <Link to="/dashboard" className="btn btn-primary">Accéder au tableau de bord</Link>
                </div>
            )}
        </div>
    );
};

export default Home;