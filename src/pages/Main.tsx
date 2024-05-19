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

import { getJson, updateJson } from "../firebase-config";
import { DateAttendance, GymAttendanceData, Month } from "../Jsons/Frequency";
import './Main.css'
import { sortWeeks } from "../utils/sortWeaks";
import AttendanceChart from "../components/Graficos";
import InfoBox from "../components/InfoBox";
import backup from "../Jsons/Humberto.json"

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
  logged: string
}

const MainPage: React.FC<MainPageProps> = ({ currentUser, logged }) => {
  const [jsonData, setData] = useState<GymAttendanceData>();
  const [extraDays, setExtra] = useState<number>(0);

  useEffect(() => {
    const getJsonData = async () => {
      const data: any = await getJson(currentUser);
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
    } // */
  };

  useEffect(() => {
    let count = 0;
    jsonData?.frequency['2024'].forEach((month) => {
      Object.values(month.weaks).forEach((weekData) => {
        if (weekData.attended.length > jsonData.participant.attendanceDaysPerWeek) {
          count++;
        }
      });
    });
    setExtra(count); // Update the state only once with the final count
  }, [jsonData]);

  const renderTableForMonth = (monthData: Month, monthIndex: number) => {
    // Ensure 'sortWeeks' returns an object whose keys are string and values are of type DateAttendance
    return Object.entries(sortWeeks(monthData.weaks)).map(([weekKey, weekData]: [string, DateAttendance]) => {
        return (<StyledTableRow 
            key={weekKey} 
            className={jsonData && weekData.attended.length >= jsonData?.participant.attendanceDaysPerWeek ? 'complete-week' : ''}
          >
            {weekData.dates.map((date: string) => (
              <StyledTableCell className="table-row" key={date} align="center">
                {date.split("-")[2]}
                <Checkbox
                  disabled={ logged !== currentUser }
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
    <div className="">
    {
        jsonData && <AttendanceChart data={jsonData} />
    }
    {
     <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between"}}>
      <InfoBox mainText={jsonData?.participant.attendanceDaysPerWeek.toString() || '0' } subText="META SEMANAL" />
      <InfoBox mainText={`${ jsonData?.participant.weight.desired}`} subText="META DE PESO ( kg )" />
      <InfoBox mainText={jsonData?.participant.bodyFatPercentage.desired.toString() || '0'} subText="META DE PORCENTAGEM DE GORDURA" />
      <InfoBox mainText={extraDays.toString()} subText="DIAS EXTRAS / DIAS A MAIS" />
    </div>
    }
    </div>
      {jsonData && jsonData.frequency['2024'].map((month, monthIndex) => (
        <TableContainer component={Paper} key={month.monthName} className="table-cont-container">
          <Table aria-label="customized table" className="inside-table">
            <TableHead>
              <TableRow>
                <StyledTableCell className="table-row" colSpan={7} align="center">
                  {month.monthName}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell className="table-row" colSpan={1} align="center">
                    Dom
                </StyledTableCell>
                <StyledTableCell className="table-row" colSpan={1} align="center">
                    Seg
                </StyledTableCell>
                <StyledTableCell className="table-row" colSpan={1} align="center">
                    Ter
                </StyledTableCell>
                <StyledTableCell className="table-row" colSpan={1} align="center">
                    Qua
                </StyledTableCell>
                <StyledTableCell className="table-row" colSpan={1} align="center">
                    Qui
                </StyledTableCell>
                <StyledTableCell className="table-row" colSpan={1} align="center">
                    Sex
                </StyledTableCell>
                <StyledTableCell className="table-row" colSpan={1} align="center">
                    Sab
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
