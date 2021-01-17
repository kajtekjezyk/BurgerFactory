import React  from 'react';

const ingredientsContext = React.createContext({
    add: () => {},
    rem: () => {}
});

export default ingredientsContext;