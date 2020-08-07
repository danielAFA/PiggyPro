import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import CardContent from "@material-ui/core/CardContent"
import Card from "@material-ui/core/Card"
import Typography from "@material-ui/core/Typography"
import CountUp from "react-countup"

const useStyles = makeStyles((theme) => ({
  card: {
    margin: 12,
  },

  pos: {
    marginBottom: 12,
  },
}))

function SubCostDisplay({ optionEstimateCost, type, peopleNumber }) {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)

  if (type === "Restaurant")
    optionEstimateCost = Math.floor(optionEstimateCost * 2.5)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.pos} color="textSecondary">
            Estimate {type} Cost:
          </Typography>
          <Typography variant="h5" component="h2" align="center">
            ${" "}
            <CountUp
              end={optionEstimateCost * peopleNumber}
              duration={1}
            ></CountUp>{" "}
            per day
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

export default SubCostDisplay
