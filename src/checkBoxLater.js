const CheckBoxOptions = ({ option }) => {
  const [checkedBoxes, updateCheckedBoxes] = useState(
    option.reduce((key, index) => ((key[index] = false), key), {})
  )
  const handleBoxChange = (event) => {
    updateCheckedBoxes({
      ...checkedBoxes,
      [event.target.name]: event.target.checked,
    })
  }
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Airline</FormLabel>
      <FormGroup>
        {option.map((value, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={checkedBoxes[value]}
                onChange={handleBoxChange}
                name={value}
              />
            }
            label={value}
          />
        ))}
      </FormGroup>
    </FormControl>
  )
}
