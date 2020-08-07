import { makeStyles, createMuiTheme } from "@material-ui/core/styles"
import orange from "@material-ui/core/colors/orange"
import blue from "@material-ui/core/colors/blue"

export const optionsStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: 12,
    minWidth: 300,
    minHeight: 480,
  },
  categoryTitle: {
    marginBottom: 5,
  },
  optionTitle: {
    marginBottom: 5,
    marginTop: 5,
  },
}))

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: orange[500],
    },
    secondary: {
      main: blue[500],
    },
  },
})
