import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import axios from 'axios';

const Login1 = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            // 1. Decode JWT from Google
            const decoded = jwtDecode(credentialResponse.credential);
            const userData = {
                email: decoded.email,
                name:
                    decoded.given_name ||
                    decoded.name?.split(' ')[0] ||
                    decoded.email.split('@')[0],
            };

            // 2. Store the user data in localStorage
            localStorage.setItem('user', JSON.stringify(userData));

            // 3. Try the first endpoint to create the user
            try {
                // await axios.post('http://localhost:8000/users', {
                //     user: {
                //         email: userData.email,
                //         username: userData.name,
                //     },
                // });
                console.info('User created successfully using first endpoint.');
            } catch (err) {
                // Handle the case where user already exists on the first endpoint
                if (
                    err.response?.status === 400 &&
                    err.response?.data?.detail === 'User with this email already exists'
                ) {
                    console.info('User already exists on first endpoint — trying second endpoint.');

                    // 4. Try the second endpoint to create the user
                    try {
                        await axios.post(
                            'http://localhost:8000/create-user/',
                            null,
                            {
                                params: {
                                    name: userData.name,
                                    email: userData.email,
                                },
                            }
                        );
                        console.info('User created successfully using second endpoint.');
                    } catch (err2) {
                        console.error('Error creating user using second endpoint:', err2.response?.data || err2.message);
                        return;
                    }
                } else {
                    console.error('Error with the first endpoint:', err.response?.data || err.message);
                    return;
                }
            }

            // 5. Update the authentication context and navigate to the net page
            login(JSON.parse(localStorage.getItem('user')));
            navigate('/networth-tracker');
        } catch (err) {
            console.error('Google login error:', err.response?.data || err.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.error('Google login failed')}
            />
        </div>
    );
};

export default Login1;
