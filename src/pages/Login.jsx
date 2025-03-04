import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Import Firebase auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import '../css/Login.css'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                // Log in user
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = '/profile'; // Redirect to Profile page after login


            } else {
                const userDocRef = doc(db, 'users', email);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    setError('User with this email already exists.');
                    setLoading(false);
                    return;
                }

                // Register new user
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                // Add user profile data to Firestore after sxign up
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    email: userCredential.user.email,
                    skills: []
                });

                window.location.href = '/profile';
            }
        } catch (err) {
            console.error("Firebase error:", err);
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            </form>

            <p>
                {isLogin ? 'Don’t have an account?' : 'Already have an account?'}
                <span onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Sign Up' : 'Login'}
                </span>
            </p>
        </div>
    );
}

export default Login;
