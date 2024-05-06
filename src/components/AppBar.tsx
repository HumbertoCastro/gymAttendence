import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import MenuIcon from "@mui/icons-material/Menu";
import SideDrawer from "./SideBar";
import { useState } from "react";
import { IconButton } from "@mui/material";

export default function DenseAppBar({ setName, name } : { setName: (string: string) => void, name: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <SideDrawer toggleDrawer={toggleDrawer} isOpen={isOpen} setName={setName} />
      <AppBar position="static" sx={{ backgroundColor: grey[900] }}>
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Aposta Academia - Participante : {name}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
