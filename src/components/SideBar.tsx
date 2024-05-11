import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import './index.css';
import { People } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getAllJsons } from '../firebase-config';

interface ReturnAllJson {
    email?: string;
    frequency?: Record<string, unknown>;  // If frequency has a known structure, replace with appropriate type
    id: string;
    name?: string;
    participant?: Record<string, unknown>; // If participant has a known structure, replace with appropriate type
}

interface AllNames {
    name: string;
    email: string;
}

interface SideDrawerProps {
    toggleDrawer: () => void;
    isOpen: boolean;
    setName: (name: string) => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ toggleDrawer, isOpen, setName }) => {
    const [allNames, setAllNames] = useState<AllNames[]>([]);

    const retrieveAllData = async () => {
        const allData: ReturnAllJson[] = await getAllJsons();
        const formattedData = allData.map((res: ReturnAllJson) => ({  
            name: res.name || 'Unknown Name',  // Provide default values or handle missing ones
            email: res.email || 'No Email'
        }));
        console.log(formattedData)
        setAllNames(formattedData);
    };

    useEffect(() => {
        retrieveAllData();
    }, []);

    const list = () => (
        <List
            sx={{
                marginTop: 10,
            }}
            className='left-bar'
            subheader={
                <ListSubheader component="div">
                    Participantes Da Aposta
                </ListSubheader>
            }
        >
            {allNames.map((item: AllNames) => (
                <ListItem button key={item.name} onClick={() => setName(item.email)} sx={{ marginLeft: '40px'}}>
                    <ListItemText primary={item.name} />
                </ListItem>
            ))}
        </List>
    );

    return (
        <Drawer
            anchor='left'
            open={isOpen}
            onClose={toggleDrawer}
            className='drawer'
        >
            <List component="nav" >
                <ListItem button key="geral" onClick={() => setName('Geral')}>
                    <ListItemText primary="Informações Gerais" />
                    <People />
                </ListItem>
                {list()}
            </List>
        </Drawer>
    );
};

export default SideDrawer;
