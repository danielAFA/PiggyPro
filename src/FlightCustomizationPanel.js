import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import Container from "@material-ui/core/Container"
import SubCostDisplay from "./SubCostDisplay"
import axios from "axios"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import { optionsStyles } from "./optionsStyles"
import { ThemeProvider } from "@material-ui/styles"
import { theme } from "./optionsStyles"

const FlightCustomizationPanel = ({
  flightData,
  currentTravelData,
  updateFlightCost,
  peopleNumber,
  days,
}) => {
  const classes = optionsStyles()

  const { avgFlight, airlineNames, avgLF, avgMF, avgHF } = flightData
  const categories = ["-1", "0", "1", "2"]
  const categoryAvg = [avgLF, avgMF, avgHF]

  const [selectedCategory, updateSelectedCategory] = useState("-1")
  const [selectedAirline, updateSelectedAirline] = useState("No Preference")
  const [airlineResponseData, updateAirlineResponseData] = useState({
    avgPrice: avgFlight,
  })

  const [currentAirlines, updateCurrentAirlines] = useState(airlineNames)
  const [estimatedFlightCost, updateEstimatedFlightCost] = useState(avgFlight)

  useEffect(() => {
    updateFlightCost(estimatedFlightCost)
  }, [estimatedFlightCost])

  const sendAirlineRequest = async (
    category = selectedCategory,
    airline = selectedAirline
  ) => {
    const flightURL = "http://172.25.2.150:8080/second/plane"
    const parsedCategory = category === "-1" ? -1 : parseInt(category)

    const requestData = {
      airline: airline,
      category: parsedCategory,
      origin: currentTravelData["origin"],
      destination: currentTravelData["destination"],
    }
    console.log(flightURL, requestData)

    const requestBody = JSON.stringify(requestData)
    try {
      const { data } = await axios({
        url: flightURL,
        method: "post",
        data: requestBody,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
      console.log(data)
      updateAirlineResponseData(data)
      updateEstimatedFlightCost(data["avgPrice"])
    } catch (error) {
      console.log(error)
    }
  }

  const sendNamesRequest = async (category = selectedCategory) => {
    const flightURL = "http://172.25.2.150:8080/second/airlineNames"
    const parsedCategory = category === "-1" ? -1 : parseInt(category)

    const requestData = {
      category: parsedCategory,
      origin: currentTravelData["origin"],
      destination: currentTravelData["destination"],
    }

    const requestBody = JSON.stringify(requestData)

    try {
      const { data } = await axios({
        url: flightURL,
        method: "post",
        data: requestBody,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
      updateCurrentAirlines(data["airlineNames"])
    } catch (error) {
      console.log(error)
    }
  }
  //marker
  function CustomizationOptionsFlights({ categories, airlineNames }) {
    const optionMap = {
      "-1": "No Preference",
      "0": "Low",
      "1": "Medium",
      "2": "High",
    }

    const PriceRadioOptions = ({ categories }) => {
      const handleCategoryChange = (event) => {
        updateSelectedCategory(event.target.value)
        console.log("category: ", event.target.value)
        console.log("airline: ", selectedAirline)

        updateSelectedAirline("No Preference")
        updateEstimatedFlightCost(categoryAvg[parseInt(event.target.value)])

        if (event.target.value === "-1") updateEstimatedFlightCost(avgFlight)

        sendNamesRequest(event.target.value)
      }
      return (
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="position"
            name="position"
            defaultValue={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categories.map((category, index) => (
              <FormControlLabel
                key={index}
                value={category}
                control={<Radio color="primary" />}
                label={optionMap[category]}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )
    }

    const AirlineRadioOptions = ({ airlineNames }) => {
      airlineNames = ["No Preference", ...airlineNames]

      const handleAirlineChange = (event) => {
        updateSelectedAirline(event.target.value)
        console.log("airline: ", event.target.value)
        console.log("category selected: ", selectedCategory)

        //Any category, any airline selected
        if (event.target.value !== "No Preference")
          sendAirlineRequest(selectedCategory, event.target.value)
        //No category, no airline selected
        else if (
          event.target.value === "No Preference" &&
          selectedCategory === "-1"
        ) {
          updateEstimatedFlightCost(avgFlight)
          //Yes category, no airline selected
        } else if (
          event.target.value === "No Preference" &&
          selectedCategory !== "-1"
        ) {
          updateEstimatedFlightCost(categoryAvg[parseInt(selectedCategory)])
        }
      }
      return (
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="position"
            name="position"
            defaultValue={selectedAirline}
            onChange={handleAirlineChange}
          >
            {airlineNames.map((airline, index) => (
              <FormControlLabel
                key={index}
                value={airline}
                control={<Radio color="primary" />}
                label={airline}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )
    }

    return (
      <Paper className={classes.paper}>
        <Grid container direction="column" justify="center">
          <Grid item>
            <Typography className={classes.categoryTitle} color="textSecondary">
              Price Category
            </Typography>
            <PriceRadioOptions categories={categories} />
          </Grid>
          <Grid item>
            <Typography className={classes.optionTitle} color="textSecondary">
              Airlines
            </Typography>
            <AirlineRadioOptions airlineNames={airlineNames} />
          </Grid>
        </Grid>
      </Paper>
    )
  }
  return (
    <Container>
      <CustomizationOptionsFlights
        categories={categories}
        airlineNames={currentAirlines}
      />
      <SubCostDisplay
        optionEstimateCost={estimatedFlightCost}
        type={"Flight"}
        peopleNumber={peopleNumber}
      />
    </Container>
  )
}

export default FlightCustomizationPanel
//<button onClick={() => console.log(airlineResponseData)}>check</button>
