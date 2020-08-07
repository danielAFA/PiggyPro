import React, { useState } from "react"
import logo from "./piggy_pros_smallest.png"

const style = {
  widht: 409,
  height: 128,
  position: "absolute",
  top: "20px",
  left: "16px",
  cursor: "pointer",
}

export default function ImageLogo() {
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  })
  return (
    <img
      style={style}
      src={logo}
      alt="Logo"
      onClick={() => window.location.reload()}
    />
  )
}
