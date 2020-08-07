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
import FormGroup from "@material-ui/core/FormGroup"
import Checkbox from "@material-ui/core/Checkbox"
import { optionsStyles } from "./optionsStyles"
import Typography from "@material-ui/core/Typography"

const RestaurantCustomizationPanel = ({
  restaurantData,
  currentTravelData,
  updateRestaurantCost,
  peopleNumber,
}) => {
  const classes = optionsStyles()

  let { avgRestaurant, restaurantTypes, avgLR, avgMR, avgHR } = restaurantData
  const categories = ["-1", "0", "1", "2"]
  const categoryAvg = [avgLR, avgMR, avgHR]
  restaurantTypes.sort()

  const [selectedCategory, updateSelectedCategory] = useState("-1")
  const [selectedRestaurants, updateSelectedRestaurants] = useState([
    "No Preference",
  ])
  const [restaurantResponseData, updateRestaurantResponseData] = useState({
    avgPrice: avgRestaurant,
  })

  const [currentRestaurants, updateCurrentRestaurants] = useState(
    restaurantTypes
  )
  const [estimatedRestaurantCost, updateEstimatedRestaurantCost] = useState(
    avgRestaurant
  )

  useEffect(() => {
    updateRestaurantCost(estimatedRestaurantCost)
  }, [estimatedRestaurantCost])

  const sendRestaurantRequest = async (
    category = selectedCategory,
    foodTypes = selectedRestaurants
  ) => {
    const restaurantURL = "http://172.25.2.150:8080/second/restaurant"
    const parsedCategory = category === "-1" ? -1 : parseInt(category)

    const requestData = {
      foodTypes: foodTypes,
      category: parsedCategory,
      destination: currentTravelData["destination"],
    }
    //console.log(restaurantURL, requestData)

    const requestBody = JSON.stringify(requestData)
    try {
      const { data } = await axios({
        url: restaurantURL,
        method: "post",
        data: requestBody,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
      //console.log(data)
      updateRestaurantResponseData(data)
      updateEstimatedRestaurantCost(data["avgPrice"])
    } catch (error) {
      console.log(error)
    }
  }

  const sendRestaurantTypesRequest = async (category = selectedCategory) => {
    const restaurantURL = "http://172.25.2.150:8080/second/restaurantTypes"
    const parsedCategory = category === "-1" ? -1 : parseInt(category)

    const requestData = {
      category: parsedCategory,
      destination: currentTravelData["destination"],
    }

    const requestBody = JSON.stringify(requestData)

    try {
      const { data } = await axios({
        url: restaurantURL,
        method: "post",
        data: requestBody,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })
      updateCurrentRestaurants(data["airlineNames"])
    } catch (error) {
      console.log(error)
    }
  }
  //marker
  function CustomizationOptionsRestaurant({ categories, restaurantTypes }) {
    const classes = optionsStyles()
    const optionMap = {
      "-1": "No Preference",
      "0": "Low",
      "1": "Medium",
      "2": "High",
    }

    const PriceRadioOptions = ({ categories }) => {
      const handleCategoryChange = (event) => {
        updateSelectedCategory(event.target.value)
        //console.log("category: ", event.target.value)
        //console.log("airline: ", selectedRestaurants)

        updateSelectedRestaurants(["No Preference"])
        updateEstimatedRestaurantCost(categoryAvg[parseInt(event.target.value)])

        if (event.target.value === "-1")
          updateEstimatedRestaurantCost(avgRestaurant)

        sendRestaurantTypesRequest(event.target.value)
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

    const RestaurantTypeCheckboxOptions = ({ restaurantTypes }) => {
      restaurantTypes = ["No Preference", ...restaurantTypes.sort()]
      const allBoxesObject = restaurantTypes.reduce(
        (key, index) => ((key[index] = false), key),
        {}
      )

      selectedRestaurants.forEach((element) => (allBoxesObject[element] = true))

      const [restaurantBoxes, updateRestaurantBoxes] = useState(allBoxesObject)
      //console.log("how many?")

      const getCheckedBoxes = (obj) => Object.keys(obj).filter((k) => obj[k])

      const handleBoxChange = (event) => {
        const tempBoxes = { ...restaurantBoxes }
        tempBoxes["No Preference"] = false
        const updatedBoxes = {
          ...tempBoxes,
          [event.target.name]: event.target.checked,
        }
        const checkedBoxesKeys = getCheckedBoxes(updatedBoxes)
        updateRestaurantBoxes(updatedBoxes)
        updateSelectedRestaurants(checkedBoxesKeys)
        //console.log(checkedBoxesKeys)
        sendRestaurantRequest(selectedCategory, checkedBoxesKeys)
      }

      const handleNoPreference = (event) => {
        if (!event.target.value) {
          const uncheckedBoxes = { ...restaurantBoxes }
          Object.keys(uncheckedBoxes).forEach(
            (v) => (uncheckedBoxes[v] = false)
          )
          updateRestaurantBoxes({
            ...uncheckedBoxes,
            [event.target.name]: true,
          })
        }
        //updateEstimatedRestaurantCost(categoryAvg[parseInt(selectedCategory)])
      }

      return (
        <FormControl component="fieldset">
          <FormGroup>
            {restaurantTypes.map((foodType, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={restaurantBoxes[foodType]}
                    color="primary"
                    onChange={
                      foodType === "No Preference"
                        ? handleNoPreference
                        : handleBoxChange
                    }
                    name={foodType}
                  />
                }
                label={foodType}
              />
            ))}
          </FormGroup>
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
          <Typography className={classes.optionTitle} color="textSecondary">
            Restaurant Types
          </Typography>
          <Grid item>
            <RestaurantTypeCheckboxOptions restaurantTypes={restaurantTypes} />
          </Grid>
        </Grid>
      </Paper>
    )
  }
  return (
    <Container className={classes.costDisplay}>
      <CustomizationOptionsRestaurant
        categories={categories}
        restaurantTypes={currentRestaurants}
      />
      <SubCostDisplay
        optionEstimateCost={estimatedRestaurantCost}
        type={"Restaurant"}
        peopleNumber={peopleNumber}
      />
    </Container>
  )
}

export default RestaurantCustomizationPanel
//<button onClick={() => console.log(restaurantResponseData)}>check</button>
