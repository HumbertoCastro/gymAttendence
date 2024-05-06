import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import './index.css';
import { People } from '@mui/icons-material';

const names = [
    'Humberto Castro',
    'Natalia Lara',
    'Gabriel',
    'Matheus',
    'Joao Souto',
    'Rodrigo',
    'Izabella'
];

export default function SideDrawer({ toggleDrawer, isOpen, setName }: { toggleDrawer: () => void, isOpen: boolean, setName: (string: string) => void }) {
    const list = () => (
        <List
            sx={{
                marginTop: 10
            }}
            className='left-bar'
            subheader={
                <ListSubheader component="div">
                    Participantes Da Aposta
                </ListSubheader>
            }
        >
            {names.map((text: string) => (
                <ListItem button key={text} onClick={() => setName(text)} sx={{ marginLeft: '40px'}}>
                    <ListItemText primary={text} />
                </ListItem>
            ))}
        </List>
    );

    return (
        <Drawer
            anchor='left'
            open={isOpen}
            onClose={toggleDrawer}
        >
            <List component="nav">
                <ListItem button key="geral" onClick={() => setName('Geral')}>
                    <ListItemText primary="Informações Gerais" />
                    <People />
                </ListItem>
                {list()}
            </List>
        </Drawer>
    );
}
