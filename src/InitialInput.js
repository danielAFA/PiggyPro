import React, { useState } from "react"

import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Container from "@material-ui/core/Container"
import SearchIcon from "@material-ui/icons/Search"
import Fab from "@material-ui/core/Fab"
import Typography from "@material-ui/core/Typography"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import axios from "axios"
import "date-fns"
import DateFnsUtils from "@date-io/date-fns"
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import InitialInputResult from "./InitialInputResult"
import Card from "@material-ui/core/Card"
import Grid from "@material-ui/core/Grid"
import RemoveIcon from "@material-ui/icons/Remove"
import AddIcon from "@material-ui/icons/Add"
import PeopleIcon from "@material-ui/icons/People"
import Badge from "@material-ui/core/Badge"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import IconButton from "@material-ui/core/IconButton"
import { ThemeProvider } from "@material-ui/styles"
import { theme } from "./panels/optionsStyles"

const useStyles = makeStyles(theme => ({
  root: {
    "vertical-align": "baseline",
    "& > *": {
      margin: theme.spacing(2),
      width: "25ch",
    },
  },
  counter: {
    display: "flex",
    flexDirection: "column",
    "& > *": {
      marginBottom: theme.spacing(2),
    },
    "& .MuiBadge-root": {
      marginRight: theme.spacing(4),
    },
  },
  section2: {
    margin: theme.spacing(2),
  },
}))

const mockResponse = {
  data: {
    initialTotal: 1259,
    avgHotel: 161,
    avgRestaurant: 23,
    avgFlight: 339,
    avgLH: 64,
    avgMH: 103,
    avgHH: 293,
    avgLF: 153,
    avgMF: 254,
    avgHF: 610,
    avgLR: 9,
    avgMR: 19,
    avgHR: 42,
    hotelStars: [2, 3, 4, 5],
    restaurantTypes: ["Burgers", "Pizza", "Mexican", "Japanese", "Steak"],
    airlineNames: ["Spirit", "United", "American", "Delta", "Frontier"],
  },
}

const InitialInput = () => {
  const classes = useStyles()
  const [origin, updateOrigin] = useState("Houston")
  const [destination, updateDestination] = useState("Orlando")
  const [departure, setDeparture] = useState(new Date("2020-07-6"))
  const [returnDate, setReturnDate] = useState(departure)
  const [travelers, updateTravelers] = useState(1)

  const [customOptions, updateCustomOptions] = useState({
    flightTickets: true,
    hotels: true,
    restaurants: true,
  })
  const [response, updateResponse] = useState()
  const [request, updateRequest] = useState()
  const handleDepartureChange = date => {
    setDeparture(date)
  }

  const handleReturnChange = date => {
    setReturnDate(date)
  }

  const handleOriginChange = e => {
    updateOrigin(e.target.value)
  }
  const handleDestinationChange = e => {
    updateDestination(e.target.value)
  }

  const handleCustoms = event => {
    updateCustomOptions({
      ...customOptions,
      [event.target.name]: event.target.checked,
    })
  }

  const handleSearchClick = () => {
    const currentRequest = {
      origin: origin,
      destination: destination,
      days: parseInt(Math.abs(departure - returnDate) / (24 * 3600 * 1000)),
      flightTickets: true,
      hotels: true,
      restaurants: true,
      people: travelers,
    }

    updateRequest(currentRequest)
    sendInitialRequest(currentRequest)
  }

  const sendInitialRequest = async request => {
    try {
      let headers = new Headers()
      headers.append("Content-Type", "application/json")
      headers.append("Access-Control-Allow-Origin", "http://localhost:3000")
      headers.append("Access-Control-Allow-Credentials", "true")

      const requestBody = JSON.stringify(request)

      const { data } =
        mockResponse ||
        (await axios({
          url: "http://172.25.2.150:8080/first/",
          method: "post",
          data: requestBody,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }))

      await updateResponse({ ...data })
    } catch (error) {
      updateResponse(null)
      console.error(error)
    }
  }

  const Counter = () => {
    return (
      <>
        <Badge color="primary" badgeContent={travelers}>
          <PeopleIcon />
        </Badge>
        <ButtonGroup>
          <IconButton
            onClick={() => {
              updateTravelers(Math.max(travelers - 1, 1))
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => {
              updateTravelers(travelers + 1)
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </ButtonGroup>
      </>
    )
  }

  const CityInput = ({ cityType, handler }) => {
    return (
      <TextField
        id="filled-basic"
        label={cityType}
        variant="filled"
        onClick={event => event.stopPropagation()}
        onFocus={event => event.stopPropagation()}
        onChange={handler}
      />
    )
  }

  const DatePicker = ({ date, handler }) => {
    return (
      <KeyboardDatePicker
        format="MM/dd/yyyy"
        margin="normal"
        id="first-day-picker"
        label="Departure Day"
        value={date}
        onChange={handler}
        onClick={event => event.stopPropagation()}
        onFocus={event => event.stopPropagation()}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    )
  }

  const SearchButton = () => {
    return (
      <Fab variant="extended" onClick={handleSearchClick} color="primary">
        <SearchIcon className={classes.extendedIcon} />
        Search
      </Fab>
    )
  }

  return (
    <div style={{ marginTop: "15px" }}>
      <ThemeProvider theme={theme}>
        <Container>
          <Card>
            <Grid container direction="column">
              <form className={classes.root} noValidate autoComplete="off">
                <CityInput cityType="Origin" handler={handleOriginChange} />
                <CityInput
                  cityType="Destination"
                  handler={handleDestinationChange}
                />

                <MuiPickersUtilsProvider
                  style={{ verticalAlign: "baseline" }}
                  utils={DateFnsUtils}
                >
                  <DatePicker
                    date={departure}
                    handler={handleDepartureChange}
                  />
                  <DatePicker date={returnDate} handler={handleReturnChange} />
                </MuiPickersUtilsProvider>
                <SearchButton />
              </form>
            </Grid>
          </Card>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions1-content"
            >
              <Typography align="center" variant="body1">
                Customize
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.section2}>
                <Grid container row>
                  <Grid item>
                    <Counter />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={customOptions.flightTickets}
                          onChange={handleCustoms}
                          name="flightTickets"
                          color="primary"
                        />
                      }
                      label="Flight Tickets"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={customOptions.hotels}
                          onChange={handleCustoms}
                          name="hotels"
                          color="primary"
                        />
                      }
                      label="Hotels"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={customOptions.restaurants}
                          onChange={handleCustoms}
                          name="restaurants"
                          color="primary"
                        />
                      }
                      label="Restaurants"
                    />
                  </Grid>
                </Grid>
              </div>
            </AccordionDetails>
          </Accordion>
        </Container>
        <Container>
          {response && (
            <InitialInputResult
              requestData={request}
              responseData={response}
              peopleNumber={travelers}
              customizationSwitchStates={customOptions}
            />
          )}
        </Container>
      </ThemeProvider>
    </div>
  )
}

export default InitialInput
