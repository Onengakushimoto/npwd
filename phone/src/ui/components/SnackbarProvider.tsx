import React, { createContext, useState, useEffect, useRef } from 'react';
import { IAlert } from '../hooks/useSnackbar';


export const SnackbarContext = createContext({ addAlert: (a: IAlert) => {} });

function SnackbarProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    if (alert) {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        setAlert(null)
      }, 2500);
    }
    return () => clearTimeout(timer.current)
  }, [alert]);


  const addAlert = (value) => setAlert(value);

  const value = { addAlert, alert }

  return (
    <SnackbarContext.Provider value={value}>
      <>
        {children}
      </>
    </SnackbarContext.Provider>
  )
}

export default SnackbarProvider;