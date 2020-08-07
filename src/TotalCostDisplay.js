import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import CardContent from "@material-ui/core/CardContent"
import Card from "@material-ui/core/Card"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import CardActions from "@material-ui/core/CardActions"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import IconButton from "@material-ui/core/IconButton"
import clsx from "clsx"
import Summary from "./Summary"
import CountUp from "react-countup"

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
    maxWidth: 400,
    margin: 12,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}))

function TotalCostDisplay({
  flightCost,
  hotelCost,
  restaurantCost,
  customizationSwitchStates,
  days,
  averageData,
  initialCost,
  peopleNumber,
}) {
  const classes = useStyles()

  const { flightTickets, hotels, restaurants } = customizationSwitchStates
  const { avgFlight, avgHotel, avgRestaurant } = averageData

  flightCost = flightTickets ? flightCost : 0
  hotelCost = hotels ? hotelCost : 0
  restaurantCost = restaurants ? Math.floor(restaurantCost * 2.5) : 0

  const [totalEstimateCost, updateEstimateCost] = useState(
    flightCost + days * (hotelCost + restaurantCost)
  )

  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    updateEstimateCost(flightCost + days * (hotelCost + restaurantCost))
  }, [flightCost, hotelCost, restaurantCost, updateEstimateCost])

  return (
    <Grid
      container
      alignContent="center"
      direction="column"
      className={classes.root}
    >
      <Card component="paper" className={classes.card} elevation={15}>
        <CardContent>
          <Typography className={classes.pos} color="textSecondary">
            Estimate Total Cost for this Trip:
          </Typography>
          <Typography variant="h3" component="h1" align="center">
            ${" "}
            <CountUp
              end={totalEstimateCost * peopleNumber}
              duration={1}
            ></CountUp>
          </Typography>

          <Summary />
        </CardContent>
      </Card>
    </Grid>
  )
}

export default TotalCostDisplay

{
  /* */
}
