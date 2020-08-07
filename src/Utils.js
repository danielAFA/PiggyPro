import axios from "axios"

export const sendRequest = async (
  url = "http://172.25.2.150:8080/first/",
  requestData = {
    origin: "Houston",
    destination: "Orlando",
    days: 2,
    flightTickets: true,
    hotels: true,
    restaurants: true,
    people: 1,
  },
  updateResponseData
) => {
  console.log(url, requestData)
  try {
    let headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Access-Control-Allow-Origin", "http://localhost:3000")
    headers.append("Access-Control-Allow-Credentials", "true")

    const requestBody = JSON.stringify(requestData)

    const { data } = await axios({
      url: url,
      method: "post",
      data: requestBody,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
    console.log(data)
    updateResponseData(data)
  } catch (error) {
    console.log(error)
  }
}
