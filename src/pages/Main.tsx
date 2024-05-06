// Import React and other necessary items
import * as React from "react";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Collapse from '@mui/material/Collapse';

import { getJson, updateJson } from "../firebase-config";
import { DateAttendance, GymAttendanceData, Month } from "../Jsons/Frequency";
import './Main.css'
import json from '../Jsons/Humberto.json'
import { sortWeeks } from "../utils/sortWeaks";
import { IconButton } from "@mui/material";
import { ExpandMoreOutlined, Title } from "@mui/icons-material";
import AttendanceChart from "../components/Graficos";

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface MainPageProps {
  currentUser: string;
}

const MainPage: React.FC<MainPageProps> = ({ currentUser }) => {
  const [jsonData, setData] = useState<GymAttendanceData>();

  useEffect(() => {
    const getJsonData = async () => {
      const data = await getJson(currentUser);
      setData(data[0] as GymAttendanceData);
    };
    getJsonData();
  }, [currentUser]);

  const handleCheck = async (date: string, weekKey: string, monthIndex: number) => {
    if (!jsonData) return;
    const updatedJsonData = { ...jsonData };
    const weekData = updatedJsonData.frequency['2024'][monthIndex].weaks[weekKey];

    const dateIndex = weekData.attended.indexOf(date);
    if (dateIndex > -1) {
      weekData.attended.splice(dateIndex, 1);
    } else {
      weekData.attended.push(date);
    }

    setData(updatedJsonData);

    try {
      await updateJson(currentUser, updatedJsonData);
      console.log('Update successful');
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };
  const renderTableForMonth = (monthData: Month, monthIndex: number) => {
    // Ensure 'sortWeeks' returns an object whose keys are string and values are of type DateAttendance
    return Object.entries(sortWeeks(monthData.weaks)).map(([weekKey, weekData]: [string, DateAttendance]) => {
        return (<StyledTableRow 
            key={weekKey} 
            className={weekData.attended.length >= jsonData?.participant.attendanceDaysPerWeek ? 'complete-week' : ''}
          >
            {weekData.dates.map((date: string) => (
              <StyledTableCell key={date} align="center">
                {date.split("-")[2]}
                <Checkbox
                  checked={weekData.attended.includes(date)}
                  onChange={() => handleCheck(date, weekKey, monthIndex)}
                />
              </StyledTableCell>
            ))}
          </StyledTableRow>)
    });
  };
  

  return (
    <div className="table-cont">
    Grafico de Frequencia
    {
        jsonData && <AttendanceChart data={jsonData} />
    }
      {jsonData && jsonData.frequency['2024'].map((month, monthIndex) => (
        <TableContainer component={Paper} key={month.monthName} className="table-cont-container">
          <Table sx={{ minWidth: 1000 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={7} align="center">
                  {month.monthName}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan={1} align="center">
                    Domingo
                </StyledTableCell>
                <StyledTableCell colSpan={1} align="center">
                    Segunda-feira
                </StyledTableCell>
                <StyledTableCell colSpan={1} align="center">
                    Terça-feira
                </StyledTableCell>
                <StyledTableCell colSpan={1} align="center">
                    Quarta-feira
                </StyledTableCell>
                <StyledTableCell colSpan={1} align="center">
                    Quinta-feira
                </StyledTableCell>
                <StyledTableCell colSpan={1} align="center">
                    Sexta-feira
                </StyledTableCell>
                <StyledTableCell colSpan={1} align="center">
                    Sabado
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderTableForMonth(month, monthIndex)}</TableBody>
          </Table>
        </TableContainer>
      ))}
    </div>
  );
};

export default MainPage;
