// client/src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = {};

        if (!email.trim()) {
            errors.email = 'L\'email est requis';
        }

        if (!password) {
            errors.password = 'Le mot de passe est requis';
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
            await login({
                email,
                password
            });
            navigate('/dashboard');
        } catch (err) {
            console.error('Erreur de connexion:', err);
        }
    };

    return (
        <div className="auth-form-container">
            <h1>Connexion</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <form className="auth-form" onSubmit={onSubmit}>
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

                <button type="submit" className="btn btn-primary btn-block">Se connecter</button>
            </form>

            <p className="auth-redirect">
                Pas encore de compte ? <Link to="/register">S'inscrire</Link>
            </p>
        </div>
    );
};

export default Login;
