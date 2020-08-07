import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import FlightCustomizationPanel from "./FlightCustomizationPanel"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    height: 400,
    width: 200,
  },
  control: {
    padding: theme.spacing(4),
  },
}))

function CustomizationDisplay() {
  const classes = useStyles()
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={4}>
          <FlightCustomizationPanel />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CustomizationDisplay
