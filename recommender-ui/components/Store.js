import React, { useState } from 'react';

export const UserIdContext = React.createContext({});

const Store = (props) => {

    const [userId, setUserId] = useState(0)

    return (
        <UserIdContext.Provider value={[userId, setUserId]}>
            {props.children}
        </UserIdContext.Provider>
    )
}

export default Store;

