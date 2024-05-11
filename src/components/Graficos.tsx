import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { GymAttendanceData } from '../Jsons/Frequency';
import { sortWeeks } from '../utils/sortWeaks';

interface Props {
  data: GymAttendanceData; // The full attendance JSON data
}


export default function AttendanceChart({ data }: Props) {
    const colorMap = {
      type: 'piecewise', // Define a piecewise color map
      ranges: [{
        upTo: data.participant.attendanceDaysPerWeek, // Threshold
        color: 'red', // Color for values below the threshold
      }, {
        from: data.participant.attendanceDaysPerWeek,
        color: 'green', // Color for values above the threshold
      }]
    };
  
    const [sizes, setSizes] = useState({
        witdh: 0,
        heigth: 0,
    })
    const processData = () => {
        const yearData = data.frequency['2024'];
        const values: number[] = [];

        yearData.forEach(month => {
        Object.entries(sortWeeks(month.weaks)).forEach(([_week, attendanceData]) => {
            values.push(attendanceData.attended.length);
        });
        });

        return { values };
    };

    const { values } = processData();

    useEffect(() => {
        const element: any = document.querySelector(".table-cont-container")
        if (element) {
            setSizes({
                witdh: element.offsetWidth,
                heigth: element.offsetHeight,
            })
        }
    }, [])


    useEffect(() => {
      // Wait for the chart to render
      setTimeout(() => {
          const bars = document.querySelectorAll('.MuiBarElement-series-yAxis1');
          bars.forEach((bar, index) => {
              const value = values[index];
              if (value < data.participant.attendanceDaysPerWeek) {
                  bar.style.fill = 'red'; // Change color to red if value is less than threshold
              } else {
                  bar.style.fill = 'rgb(104, 255, 84)'; // Default color
              }
          });
      }, 1000); // Adjust timeout as needed to ensure it runs after chart render
  }, [values]);

  return (
    <>
    <BarChart
      sx={
        {
            backgroundColor: 'white',
            borderRadius: '6px'
        }
      }
      className='barchart'
      xAxis={[{
        id: 'barCategories',
        data: values.map((_x, index) => `${index + 1}`),
        scaleType: 'band',
      }]}
      yAxis={[{
        id: 'yAxis1',
        position: 'left',
        max: 7, // Setting a fixed maximum y-axis value
        scaleType: 'linear',
      }]}
      series={[{
        id: 'yAxis1',
        data: values,
      }]}
      width={sizes.witdh}
      height={sizes.heigth * 1.2}
    />
    </>
  );
}