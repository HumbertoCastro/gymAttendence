import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import MenuIcon from "@mui/icons-material/Menu";
import SideDrawer from "./SideBar";
import { useState } from "react";
import { IconButton } from "@mui/material";

export default function DenseAppBar({ setName, email } : { setName: (string: string) => void, email: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <SideDrawer toggleDrawer={toggleDrawer} isOpen={isOpen} setName={setName} />
      <AppBar position="static" sx={{ backgroundColor: grey[50], boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }}>
        <Toolbar variant="dense">
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="black" component="div">
            Aposta Academia - Participante : {email}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
