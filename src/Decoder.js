import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import Processing from './Processing';

// This module performs an 'instruction' after the login,
// such as posting a high score (when the user play before login).
// This is done by redirecting to '/login/cmd/{encoded}',
// where the encoded is an encoded 'instruction' (a Json object).

const Decoder = props => {
  const [redirect, setRedirect] = useState(null);
  const {
    user,
    db,
    match: {
      params: { encoded },
    },
  } = props;
  const params = JSON.parse(decodeURIComponent(encoded));

  useEffect(() => {
    // App specific code should be written here. This is just a sample.
    if (params.cmd === 'something') {
      // do something using the data given in params.
      const { foo, bar, url } = params;
      console.log(foo, bar, user, db); // to eliminate warning
      //await do.something();
      setRedirect(url);
    }
  }, [db, params, user]);

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return <Processing user={user} />;
};

export default Decoder;
