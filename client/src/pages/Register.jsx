// client/src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const { register, error, setError } = useAuth();
    const navigate = useNavigate();

    const { username, email, password, confirmPassword } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = {};

        if (!username.trim()) {
            errors.username = 'Le nom d\'utilisateur est requis';
        } else if (username.length < 3) {
            errors.username = 'Le nom d\'utilisateur doit comporter au moins 3 caractères';
        }

        if (!email.trim()) {
            errors.email = 'L\'email est requis';
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
            errors.email = 'Email invalide';
        }

        if (!password) {
            errors.password = 'Le mot de passe est requis';
        } else if (password.length < 6) {
            errors.password = 'Le mot de passe doit comporter au moins 6 caractères';
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await register({
                username,
                email,
                password
            });
            navigate('/dashboard');
        } catch (err) {
            console.error('Erreur d\'inscription:', err);
        }
    };

    return (
        <div className="auth-form-container">
            <h1>Inscription</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <form className="auth-form" onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={onChange}
                        placeholder="Entrez votre nom d'utilisateur"
                    />
                    {formErrors.username && <div className="form-error">{formErrors.username}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="Entrez votre email"
                    />
                    {formErrors.email && <div className="form-error">{formErrors.email}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Entrez votre mot de passe"
                    />
                    {formErrors.password && <div className="form-error">{formErrors.password}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        placeholder="Confirmez votre mot de passe"
                    />
                    {formErrors.confirmPassword && <div className="form-error">{formErrors.confirmPassword}</div>}
                </div>

                <button type="submit" className="btn btn-primary btn-block">S'inscrire</button>
            </form>

            <p className="auth-redirect">
                Déjà inscrit ? <Link to="/login">Se connecter</Link>
            </p>
        </div>
    );
};

export default Register;
