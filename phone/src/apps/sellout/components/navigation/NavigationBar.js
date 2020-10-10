import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import HomeIcon from '@material-ui/icons/Home';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  icon: {
    color: "#f44336"
  }
}))

export const NavigationBar = () => {
  const classes = useStyles();
  const [activePage, setActivePage] = useState(0);
  return (
    <BottomNavigation
      valule={activePage} 
      onChange={(event, newPage) => {
        setActivePage(newPage)
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction 
        component={Link}
        icon={<HomeIcon />}
        to="/sellout"
      />
      <BottomNavigationAction 
        component={Link}
        icon={<AddCircleIcon />}
        to="/sellout/new"
      />
      <BottomNavigationAction 
        component={Link}
        icon={<FaceIcon />}
        to="/sellout/profile"
      />
    </BottomNavigation>
  )
}
