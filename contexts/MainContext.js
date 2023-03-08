import PropTypes from 'prop-types';
import React, {useState} from 'react';

// This a main context for the app.
const MainContext = React.createContext({});

const MainProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(true);
  const [updateComment, setUpdateComment] = useState(true);
  const [updateLike, setUpdateLike] = useState(true);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        update,
        setUpdate,
        updateComment,
        setUpdateComment,
        updateLike,
        setUpdateLike,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
