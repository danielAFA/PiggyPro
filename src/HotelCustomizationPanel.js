import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import Container from "@material-ui/core/Container"
import SubCostDisplay from "./SubCostDisplay"
import axios from "axios"
import Typography from "@material-ui/core/Typography"
import { optionsStyles } from "./optionsStyles"
import StarRateIcon from "@material-ui/icons/StarRate"
import { ThemeProvider } from "@material-ui/styles"
import { theme } from "./optionsStyles"

const HotelCustomizationPanel = ({
  hotelData,
  currentTravelData,
  updateHotelCost,
  days,
  peopleNumber,
}) => {
  const classes = optionsStyles()

  let { avgHotel, hotelStars, avgLH, avgMH, avgHH } = hotelData
  const categories = ["-1", "0", "1", "2"]
  const categoryAvg = [avgLH, avgMH, avgHH]

  hotelStars = hotelStars.map((element) => element.toString())

  const [selectedCategory, updateSelectedCategory] = useState("-1")
  const [selectedStars, updateSelectedStars] = useState("No Preference")
  const [hotelResponseData, updateHotelResponseData] = useState({
    avgPrice: avgHotel,
  })

  const [currentStars, updateCurrentStars] = useState(hotelStars)
  const [estimatedHotelCost, updateEstimatedHotelCost] = useState(avgHotel)

  useEffect(() => {
    updateHotelCost(estimatedHotelCost)
  }, [estimatedHotelCost])

  const sendHotelRequest = async (
    category = selectedCategory,
    stars = selectedStars
  ) => {
    const hotelURL = "http://172.25.2.150:8080/second/hotel"
    const parsedCategory = category === "-1" ? -1 : parseInt(category)

    const requestData = {
      stars: stars,
      category: parsedCategory,
      destination: currentTravelData["destination"],
    }
    console.log(hotelURL, requestData)

    const requestBody = JSON.stringify(requestData)
    try {
      const { data } = await axios({
        url: hotelURL,
        method: "post",
        data: requestBody,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
      console.log(data)
      updateHotelResponseData(data)
      updateEstimatedHotelCost(data["avgPrice"])
    } catch (error) {
      console.log(error)
    }
  }

  const sendStarsRequest = async (category = selectedCategory) => {
    const hotelURL = "http://172.25.2.150:8080/second/hotelStars"
    const parsedCategory = category === "-1" ? -1 : parseInt(category)

    const requestData = {
      category: parsedCategory,
      destination: currentTravelData["destination"],
    }

    const requestBody = JSON.stringify(requestData)

    try {
      const { data } = await axios({
        url: hotelURL,
        method: "post",
        data: requestBody,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
      updateCurrentStars(data["hotelStars"].sort())
    } catch (error) {
      console.log(error)
    }
  }
  //marker
  function CustomizationOptionsHotel({ categories, hotelStars }) {
    hotelStars = hotelStars.map((element) => element.toString())
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
        console.log("airline: ", selectedStars)

        updateSelectedStars("No Preference")
        updateEstimatedHotelCost(categoryAvg[parseInt(event.target.value)])

        if (event.target.value === "-1") updateEstimatedHotelCost(avgHotel)

        sendStarsRequest(event.target.value)
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

    const StarsRadioButton = ({ hotelStars }) => {
      hotelStars = ["No Preference", ...hotelStars]

      const handleStarsChange = (event) => {
        updateSelectedStars(event.target.value)
        console.log("airline: ", event.target.value)
        console.log("category selected: ", selectedCategory)

        //Any category, any airline selected
        if (event.target.value !== "No Preference")
          sendHotelRequest(selectedCategory, event.target.value)
        //No category, no airline selected
        else if (
          event.target.value === "No Preference" &&
          selectedCategory === "-1"
        ) {
          updateEstimatedHotelCost(avgHotel)
          //Yes category, no airline selected
        } else if (
          event.target.value === "No Preference" &&
          selectedCategory !== "-1"
        ) {
          updateEstimatedHotelCost(categoryAvg[parseInt(selectedCategory)])
        }
      }

      const getStars = (number) => {
        if (number === "No Preference") return "No Preference"
        number = parseInt(number)
        const stars = []
        for (let i = 0; i < number; i++) {
          stars.push(<StarRateIcon key={i} />)
        }
        return <div>{stars}</div>
      }
      return (
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="position"
            name="position"
            defaultValue={selectedStars}
            onChange={handleStarsChange}
          >
            {hotelStars.map((stars, index) => (
              <FormControlLabel
                key={index}
                value={stars}
                control={<Radio color="primary" />}
                label={getStars(stars)}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )
    }

    return (
      <Paper className={classes.paper}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <Grid item>
            <Typography className={classes.categoryTitle} color="textSecondary">
              Price Category
            </Typography>
            <PriceRadioOptions categories={categories} />
          </Grid>
          <Grid item>
            <Typography className={classes.optionTitle} color="textSecondary">
              Hotel Stars
            </Typography>
            <StarsRadioButton hotelStars={hotelStars} />
          </Grid>
        </Grid>
      </Paper>
    )
  }
  return (
    <Container>
      <CustomizationOptionsHotel
        categories={categories}
        hotelStars={currentStars}
      />
      <SubCostDisplay
        optionEstimateCost={estimatedHotelCost}
        type={"Hotel"}
        days={days}
        peopleNumber={peopleNumber}
      />
    </Container>
  )
}

export default HotelCustomizationPanel
//<button onClick={() => console.log(hotelResponseData)}>check</button>
