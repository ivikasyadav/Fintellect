// ProfileContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './Authcontext';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const { user } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);

    const fetchProfiles = async () => {
        if (!user) return;
        try {
            const response = await axios.get(`http://localhost:8000/profiles/${user.email}`);
            setProfiles(response.data);
            if (!selectedProfile && response.data.length > 0) {
                setSelectedProfile(response.data[0]); // Set first profile if none selected
            }
        } catch (error) {
            console.error("Failed to fetch profiles", error);
        }
    };

    const addProfile = async (profile_name) => {
        try {
            const response = await axios.post("http://localhost:8000/profiles", {
                user_id: user.email,
                profile_name,
            });
            setProfiles([...profiles, response.data]);
            setSelectedProfile(response.data); // Automatically select the new profile after creation
        } catch (error) {
            console.error("Failed to add profile", error);
        }
    };

    const deleteProfile = async (profile_id) => {
        try {
            await axios.delete(`http://localhost:8000/profiles/${user.email}/${profile_id}`);
            const filtered = profiles.filter(p => p.id !== profile_id);
            setProfiles(filtered);
            if (selectedProfile?.id === profile_id && filtered.length > 0) {
                setSelectedProfile(filtered[0]);
            } else if (filtered.length === 0) {
                setSelectedProfile(null);
            }
        } catch (error) {
            console.error("Failed to delete profile", error);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [user]);

    return (
        <ProfileContext.Provider value={{
            profiles,
            selectedProfile,
            setSelectedProfile,
            addProfile,
            deleteProfile
        }}>
            {children}
        </ProfileContext.Provider>
    );
};
