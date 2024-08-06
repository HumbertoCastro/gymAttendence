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
import "react-toastify/dist/ReactToastify.css";

import { getJson, updateJson } from "../firebase-config";
import { DateAttendance, GymAttendanceData, Month } from "../Jsons/Frequency";
import "./Main.css";
import { sortWeeks } from "../utils/sortWeaks";
import AttendanceChart from "../components/Graficos";
import InfoBox from "../components/InfoBox";
import { CheckBox, CheckBoxOutlined } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import CustomToast from "../components/CustomToast";

const imagePaths = [
  "assets/pessoas/celo.png",
  "assets/pessoas/gabs.png",
  "assets/pessoas/nata.png",
  "assets/pessoas/joao.png",
  "assets/pessoas/bela.png",
  "assets/pessoas/isa.png",
  "assets/pessoas/eu.png",
  "assets/pessoas/mada.png",
  "assets/pessoas/math.png",
  "assets/pessoas/diga.png",
]

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  return imagePaths[randomIndex];
};

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
  logged: string;
}

const MainPage: React.FC<MainPageProps> = ({ currentUser, logged }) => {
  const [jsonData, setData] = useState<GymAttendanceData>();
  const [extraDays, setExtra] = useState<number>(0);
  const [extraDaysEnabled, setExtraEnabled] = useState<boolean>(false);

  useEffect(() => {
    const getJsonData = async () => {
      const data: any = await getJson(currentUser);
      setData(data[0] as GymAttendanceData);
    };
    getJsonData();
  }, [currentUser]);

  const handleCheck = async (
    date: string,
    weekKey: string,
    monthIndex: number,
    checked: boolean
  ) => {
    if (checked) {
      const imageSrc = getRandomImage();    
      toast(<CustomToast imageSrc={imageSrc} />);
    }
    if (!jsonData) return;
    const updatedJsonData = { ...jsonData };
    const weekData = updatedJsonData.frequency['2024'][monthIndex].weaks[weekKey];

    const dateIndex = weekData.attended.indexOf(date);
    if (dateIndex > -1) {
      weekData.attended.splice(dateIndex, 1);
    } else {
      weekData.attended.push(date);
    }
    if (extraDaysEnabled || jsonData?.extraDaysUsed?.includes(date)) {
      if (updatedJsonData["extraDaysUsed"].includes(date)) updatedJsonData["extraDaysUsed"].splice(updatedJsonData["extraDaysUsed"].indexOf(date), 1);
      else if (updatedJsonData["extraDaysUsed"]) updatedJsonData["extraDaysUsed"].push(date);
      else updatedJsonData["extraDaysUsed"] = [date];
    }

    setData(updatedJsonData);

    try {
      await updateJson(currentUser, updatedJsonData);
      console.log('Update successful');
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  useEffect(() => {
    let count = 0;
    jsonData?.frequency["2024"].forEach((month) => {
      Object.values(month.weaks).forEach((weekData) => {
        const extraDaysInWeek = weekData.attended.filter((date) =>
          jsonData.extraDaysUsed?.includes(date)
        ).length;
        if (
          weekData.attended.length - extraDaysInWeek >
          jsonData.participant.attendanceDaysPerWeek
        ) {
          count++;
        }
      });
    });
    if (count - (jsonData?.extraDaysUsed?.length || 0) === 0)
      setExtraEnabled(false);
    setExtra(
      count - (jsonData?.extraDaysUsed?.length || 0) <= 0
        ? 0
        : count - (jsonData?.extraDaysUsed?.length || 0)
    );
  }, [jsonData]);

  const isDateOlderThanNineDays = (date: string): boolean => {
    const currentDate = new Date();
    const checkDate = new Date(date);
    const diffTime = currentDate.getTime() - checkDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays > 9;
  };

  const isDateMoreThanThreeDaysInFuture = (date: string): boolean => {
    const currentDate = new Date();
    const checkDate = new Date(date);
    const diffTime = checkDate.getTime() - currentDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays > 0;
  };

  const renderTableForMonth = (monthData: Month, monthIndex: number) => {
    return Object.entries(sortWeeks(monthData.weaks)).map(
      ([weekKey, weekData]: [string, DateAttendance]) => {
        return (
          <StyledTableRow
            key={weekKey}
            className={
              jsonData &&
              weekData.attended.length >=
                jsonData?.participant.attendanceDaysPerWeek
                ? "complete-week"
                : ""
            }
          >
            {weekData.dates.map((date: string) => (
              <StyledTableCell className="table-row" key={date} align="center">
                {date.split("-")[2]}
                <Checkbox
                  checkedIcon={
                    jsonData?.extraDaysUsed?.includes(date) ? (
                      <CheckBox color="secondary" />
                    ) : (
                      <CheckBoxOutlined />
                    )
                  }
                  disabled={
                    jsonData?.extraDaysUsed?.includes(date)
                      ? false
                      : extraDaysEnabled == true
                      ? false
                      : logged !== currentUser ||
                        isDateOlderThanNineDays(date) ||
                        isDateMoreThanThreeDaysInFuture(date)
                  }
                  checked={weekData.attended.includes(date)}
                  onChange={({ target: { checked } }) =>
                    handleCheck(date, weekKey, monthIndex, checked)
                  }
                />
              </StyledTableCell>
            ))}
          </StyledTableRow>
        );
      }
    );
  };

  const useDiasExtras = () => {
    setExtraEnabled(!extraDaysEnabled);
  };

  return (
    <div className="table-cont">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="">
        {jsonData && <AttendanceChart data={jsonData} />}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <InfoBox
            mainText={
              jsonData?.participant.attendanceDaysPerWeek.toString() || "0"
            }
            subText="META SEMANAL"
          />
          <InfoBox
            mainText={`${jsonData?.participant.weight.desired}`}
            subText="META DE PESO ( kg )"
          />
          <InfoBox
            mainText={
              jsonData?.participant.bodyFatPercentage.desired.toString() || "0"
            }
            subText="META DE PORCENTAGEM DE GORDURA"
          />
          <InfoBox
            mainText={extraDays.toString()}
            subText="DIAS EXTRAS / DIAS A MAIS"
            callback={
              extraDays > 0 && logged === currentUser
                ? useDiasExtras
                : undefined
            }
            extraDaysEnabled={extraDaysEnabled}
          />
        </div>
      </div>
      {jsonData &&
        jsonData.frequency["2024"].map((month, monthIndex) => (
          <TableContainer
            component={Paper}
            key={month.monthName}
            className="table-cont-container"
          >
            <Table aria-label="customized table" className="inside-table">
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    className="table-row"
                    colSpan={7}
                    align="center"
                  >
                    {month.monthName}
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell
                    className="table-row"
                    colSpan={1}
                    align="center"
                  >
                    Dom
                  </StyledTableCell>
                  <StyledTableCell
                    className="table-row"
                    colSpan={1}
                    align="center"
                  >
                    Seg
                  </StyledTableCell>
                  <StyledTableCell
                    className="table-row"
                    colSpan={1}
                    align="center"
                  >
                    Ter
                  </StyledTableCell>
                  <StyledTableCell
                    className="table-row"
                    colSpan={1}
                    align="center"
                  >
                    Qua
                  </StyledTableCell>
                  <StyledTableCell
                    className="table-row"
                    colSpan={1}
                    align="center"
                  >
                    Qui
                  </StyledTableCell>
                  <StyledTableCell
                    className="table-row"
                    colSpan={1}
                    align="center"
                  >
                    Sex
                  </StyledTableCell>
                  <StyledTableCell
                    className="table-row"
                    colSpan={1}
                    align="center"
                  >
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
