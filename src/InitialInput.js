import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Container from "@material-ui/core/Container"
import SearchIcon from "@material-ui/icons/Search"
import Fab from "@material-ui/core/Fab"
import Typography from "@material-ui/core/Typography"
import FormGroup from "@material-ui/core/FormGroup"
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
import { theme } from "./optionsStyles"
import ImageLogo from "./ImageLogo"

const useStyles = makeStyles((theme) => ({
  root: {
    "vertical-align": "baseline",
    "& > *": {
      margin: theme.spacing(2),
      width: "25ch",
    },
  },

  counter: {
    "display": "flex",
    "flexDirection": "column",
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

const InitialInput = React.memo(() => {
  const classes = useStyles()
  const margin = { marginTop: "15px" }
  const [tripOrigin, updateTripOrigin] = useState("Houston")
  const [tripDestination, updateTripDestination] = useState("Orlando")
  const [startingDate, setStartingDate] = useState(new Date("2020-07-6"))
  const [endingDate, setEndingDate] = useState(startingDate)
  const [peopleNumber, updatePeopleNumber] = useState(1)

  const [customizationSwitchStates, updateCustomizationSwitchStates] = useState(
    {
      flightTickets: true,
      hotels: true,
      restaurants: true,
    }
  )
  const [responseData, updateResponseData] = useState(false)
  const [requestData, updateRequestData] = useState(false)
  const handleStartingDateChange = (date) => {
    setStartingDate(date)
  }

  const handleEndingDateChange = (date) => {
    setEndingDate(date)
  }

  const Counter = () => {
    return (
      <>
        <Badge color="primary" badgeContent={peopleNumber}>
          <PeopleIcon />
        </Badge>
        <ButtonGroup>
          <IconButton
            onClick={() => {
              updatePeopleNumber(Math.max(peopleNumber - 1, 1))
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => {
              updatePeopleNumber(peopleNumber + 1)
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </ButtonGroup>
      </>
    )
  }

  const handleTripOriginChange = (e) => {
    updateTripOrigin(e.target.value)
  }
  const handleTripDestinationChange = (e) => {
    updateTripDestination(e.target.value)
  }

  const handleSwitchChange = (event) => {
    updateCustomizationSwitchStates({
      ...customizationSwitchStates,
      [event.target.name]: event.target.checked,
    })
  }

  const handleSearchClick = () => {
    sendInitialRequest()
  }
  const sendInitialRequest = async () => {
    try {
      let headers = new Headers()
      headers.append("Content-Type", "application/json")
      headers.append("Access-Control-Allow-Origin", "http://localhost:3000")
      headers.append("Access-Control-Allow-Credentials", "true")

      const requestData = {
        origin: tripOrigin,
        destination: tripDestination,
        days: parseInt(
          Math.abs(startingDate - endingDate) / (24 * 3600 * 1000)
        ),
        flightTickets: true,
        hotels: true,
        restaurants: true,
        people: 2,
      }

      updateRequestData(requestData)

      const requestBody = JSON.stringify(requestData)

      const { data } = await axios({
        url: "http://172.25.2.150:8080/first/",
        method: "post",
        data: requestBody,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })

      /* const data = {
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
      } */
      updateResponseData(false)
      updateResponseData({ ...data })
    } catch (error) {
      updateResponseData(false)
      console.log(error)
    }
  }

  return (
    <div style={margin}>
      <ThemeProvider theme={theme}>
        <ImageLogo />
        <Container>
          <Card>
            <Grid container direction="column">
              <form className={classes.root} noValidate autoComplete="off">
                <TextField
                  id="filled-basic"
                  label="Origin"
                  variant="filled"
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                  onChange={handleTripOriginChange}
                />

                <TextField
                  id="filled-basic"
                  label="Destination"
                  variant="filled"
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                  onChange={handleTripDestinationChange}
                />

                <MuiPickersUtilsProvider
                  style={{ verticalAlign: "baseline" }}
                  utils={DateFnsUtils}
                >
                  <KeyboardDatePicker
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="first-day-picker"
                    label="Departure Day"
                    value={startingDate}
                    onChange={handleStartingDateChange}
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />

                  <KeyboardDatePicker
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="last-day-picker"
                    label="Return Day"
                    value={endingDate}
                    onChange={handleEndingDateChange}
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
                <Fab
                  variant="extended"
                  onClick={handleSearchClick}
                  color="primary"
                >
                  <SearchIcon className={classes.extendedIcon} />
                  Search
                </Fab>
              </form>
            </Grid>
          </Card>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions1-content"
              id="additional-actions1-header"
            >
              <Typography gutterBottom align="center" variant="body1">
                Customize
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.section2}>
                <FormGroup row>
                  <Grid item>
                    <Counter />
                  </Grid>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={customizationSwitchStates.flightTickets}
                        onChange={handleSwitchChange}
                        name="flightTickets"
                        color="primary"
                      />
                    }
                    label="Flight Tickets"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={customizationSwitchStates.hotels}
                        onChange={handleSwitchChange}
                        name="hotels"
                        color="primary"
                      />
                    }
                    label="Hotels"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={customizationSwitchStates.restaurants}
                        onChange={handleSwitchChange}
                        name="restaurants"
                        color="primary"
                      />
                    }
                    label="Restaurants"
                  />
                </FormGroup>
              </div>
            </AccordionDetails>
          </Accordion>
        </Container>
        <Container>
          {responseData && (
            <InitialInputResult
              requestData={requestData}
              responseData={responseData}
              peopleNumber={peopleNumber}
              customizationSwitchStates={customizationSwitchStates}
            />
          )}
        </Container>
      </ThemeProvider>
    </div>
  )
})

export default InitialInput
