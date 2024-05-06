import * as React from 'react';
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { GymAttendanceData } from '../Jsons/Frequency';
import { sortWeeks } from '../utils/sortWeaks';

interface Props {
  data: GymAttendanceData; // The full attendance JSON data
}

export default function AttendanceChart({ data }: Props) {
    const [sizes, setSizes] = useState({
        witdh: 0,
        heigth: 0,
    })
    const processData = () => {
        const yearData = data.frequency['2024'];
        const values: number[] = [];

        yearData.forEach(month => {
        Object.entries(sortWeeks(month.weaks)).forEach(([week, attendanceData], index) => {
            values.push(attendanceData.attended.length);
        });
        });

        return { values };
    };

    const { values } = processData();

    useEffect(() => {
        const element = document.querySelector(".table-cont-container")
        if (element) {
            setSizes({
                witdh: element.offsetWidth,
                heigth: element.offsetHeight,
            })
        }
    }, [])

  return (
    <>
    <BarChart
      sx={
        {
            backgroundColor: 'rgba(224, 224, 224, 1)',
            borderRadius: '6px'
        }
      }
      className='barchart'
      xAxis={[{
        id: 'barCategories',
        data: values.map((x, index) => `${index + 1}`),
        scaleType: 'band',
      }]}
      yAxis={[{
        id: 'yAxis1',
        position: 'left',
        max: 7, // Setting a fixed maximum y-axis value
        scaleType: 'linear',
      }]}
      series={[{
        data: values,
      }]}
      width={sizes.witdh}
      height={sizes.heigth * 1.2}
    />
    </>
  );
}
