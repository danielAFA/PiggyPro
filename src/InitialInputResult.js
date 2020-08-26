import React, { useState } from "react"
import TotalCostDisplay from "./TotalCostDisplay"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"

import FlightCustomizationPanel from "./panels/FlightCustomizationPanel"
import HotelCustomizationPanel from "./panels/HotelCustomizationPanel"
import RestaurantCustomizationPanel from "./panels/RestaurantCustomizationPanel"

const useStyles = makeStyles(theme => ({
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
  customizationPanel: {
    height: 1000,
    widht: 1,
  },
}))

const InitialInputResult = React.memo(
  ({ requestData, responseData, customizationSwitchStates, peopleNumber }) => {
    const classes = useStyles()
    const { origin, destination, days } = requestData
    const [flightCost, updateFlightCost] = useState(responseData["avgFlight"])
    const [hotelCost, updateHotelCost] = useState(responseData["avgHotel"])
    const [restaurantCost, updateRestaurantCost] = useState(
      responseData["avgRestaurant"]
    )

    const flightData = (({ avgFlight, airlineNames, avgLF, avgMF, avgHF }) => ({
      avgFlight,
      airlineNames,
      avgLF,
      avgMF,
      avgHF,
    }))(responseData)

    const hotelData = (({
      avgHotel,
      hotelStars,
      avgLH,
      avgMH,
      avgHH,
      days,
    }) => ({
      avgHotel,
      hotelStars,
      avgLH,
      avgMH,
      avgHH,
    }))(responseData)

    const restaurantData = (({
      avgRestaurant,
      restaurantTypes,
      avgLR,
      avgMR,
      avgHR,
    }) => ({ avgRestaurant, restaurantTypes, avgLR, avgMR, avgHR, days }))(
      responseData
    )

    const averageData = (({ avgFlight, avgHotel, avgRestaurant }) => ({
      avgFlight,
      avgHotel,
      avgRestaurant,
    }))(responseData)

    return (
      <>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <TotalCostDisplay
              flightCost={flightCost}
              hotelCost={hotelCost}
              restaurantCost={restaurantCost}
              days={days}
              customizationSwitchStates={customizationSwitchStates}
              averageData={averageData}
              peopleNumber={peopleNumber}
              initialTotal={responseData["initialTotal"]}
            />
          </Grid>

          <Grid container direction="row" justify="center">
            {customizationSwitchStates["flightTickets"] === true && (
              <Grid className={classes.cutomizationPanel} item>
                <FlightCustomizationPanel
                  flightData={flightData}
                  currentTravelData={{
                    origin: origin,
                    destination: destination,
                  }}
                  days={days}
                  updateFlightCost={updateFlightCost}
                  peopleNumber={peopleNumber}
                />
              </Grid>
            )}
            {customizationSwitchStates["hotels"] === true && (
              <Grid item className={classes.cutomizationPanel}>
                <HotelCustomizationPanel
                  hotelData={hotelData}
                  currentTravelData={{
                    origin: origin,
                    destination: destination,
                  }}
                  updateHotelCost={updateHotelCost}
                  days={days}
                  peopleNumber={peopleNumber}
                />
              </Grid>
            )}
            {customizationSwitchStates["restaurants"] === true && (
              <Grid item className={classes.cutomizationPanel}>
                <RestaurantCustomizationPanel
                  restaurantData={restaurantData}
                  currentTravelData={{
                    origin: origin,
                    destination: destination,
                  }}
                  updateRestaurantCost={updateRestaurantCost}
                  days={days}
                  peopleNumber={peopleNumber}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </>
    )
  }
)

export default InitialInputResult
