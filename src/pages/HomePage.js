import React from 'react';
import { useAuth } from '~/hooks/useAuth';
import { useAuthActions } from '~/hooks/useAuthActions';

const HomePage = () => {
    const { handleLogout } = useAuthActions();
    const { currentUser } = useAuth();

    console.log(currentUser);

    return (
        <div>
            <h1>Homepage </h1>
            <img src={currentUser.photoURL} alt={currentUser.displayName} />
            <p>Name: {currentUser.displayName}</p>
            <p>Email: {currentUser.email}</p>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
};

export default HomePage;
