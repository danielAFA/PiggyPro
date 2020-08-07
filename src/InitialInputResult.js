import React, { useState, useEffect } from "react"
import TotalCostDisplay from "./TotalCostDisplay"
import Zoom from "@material-ui/core/Zoom"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
//import CustomizationDisplay from "./CustomizationDisplay"
import FlightCustomizationPanel from "./FlightCustomizationPanel"
import HotelCustomizationPanel from "./HotelCustomizationPanel"
import RestaurantCustomizationPanel from "./RestaurantCustomizationPanel"

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
  customizationPanel: {
    height: 1000,
    widht: 1,
  },
}))

const InitialInputResult = React.memo(
  ({ requestData, responseData, customizationSwitchStates, peopleNumber }) => {
    const classes = useStyles()

    const [response, updateResponse] = useState(responseData)
    const { origin, destination } = requestData
    const [flightCost, updateFlightCost] = useState(responseData["avgFlight"])
    const [hotelCost, updateHotelCost] = useState(responseData["avgHotel"])
    const [restaurantCost, updateRestaurantCost] = useState(
      responseData["avgRestaurant"]
    )

    console.log(responseData)
    console.log(responseData)
    console.log(flightCost)

    const { days } = requestData

    const [estimatedFinalCost, updateEstidatedFinalCost] = useState(
      responseData["initialTotal"]
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

    const AnimateTotalAppearance = (props) => {
      return (
        <div {...props}>
          <TotalCostDisplay
            totalEstimateCost={estimatedFinalCost}
            customizationSwitchStates={customizationSwitchStates}
            updateEstidatedFinalCost={updateEstidatedFinalCost}
            peopleNumber={peopleNumber}
          />
        </div>
      )
    }
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
