import * as React from 'react';
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { GymAttendanceData } from '../Jsons/Frequency';
import { getAllJsons } from '../firebase-config';

export default function GeneralInfo() {
    const [data, setData] = useState<GymAttendanceData[]>([]);
    const widthScream = window.innerWidth
    const heighScream = window.innerHeight
    const [chartData, setChartData] = useState({ labels: [], values: [] });

    const getjsons = async () => {
        const jsonData = await getAllJsons();
        if (jsonData) setData(jsonData as GymAttendanceData[]);
    }

    useEffect(() => {
        getjsons();
    }, []);

    useEffect(() => {
        if (data) {
            const labels = data.map(item => item.name);
            const values = data.map(item => {
                let count = 0;
                Object.values(item.frequency).forEach(month => {
                    console.log(month, item.name)
                    month.forEach(m => {
                        Object.values(m.weaks).forEach(week => {
                            if (week.attended.length >= item.participant.attendanceDaysPerWeek) {
                                count++;
                            }
                        });
                    });
                });
                return count;
            });
            setChartData({ labels, values });
        }
    }, [data]);

  return (
    <div className='table-cont'>
        <h1>Frequencia Geral</h1>
        <p>Semanas Acima ou igual a meta</p>
        {chartData.labels.length > 0 && (
            <BarChart
                sx={
                {
                    backgroundColor: 'rgba(224, 224, 224, 1)',
                    borderRadius: '6px'
                }
                }
                xAxis={[{
                    id: 'barCategories',
                    data: chartData.labels,
                    scaleType: 'band'
                }]}
                yAxis={[{
                    id: 'yAxis1',
                    position: 'left',
                    scaleType: 'linear',
                    max: 54
                }]}
                series={[{
                    data: chartData.values,
                }]}
                width={widthScream * 0.95}
                height={heighScream * 0.6}
            />
        )}
        <div className="participant-goals">
            <h2>Participant Goals</h2>
            {data.map(participant => (
                <div key={participant.name} className="participant-goal">
                    <h3 className='name'>{participant.name}: </h3>
                    <div className='info-div'>
                        <p>Peso Inicial ( kg ) </p>
                        <h1 className='info'>{participant.participant.weight.current}</h1>
                    </div>
                    <div className='info-div'>
                        <p>Peso Desejado ( kg ) </p>
                        <h1 className='info-red'>{participant.participant.weight.desired}</h1>
                    </div>
                    <div className='info-div'>
                        <p>BF ( % ) Atual </p>
                        <h1 className='info'>{participant.participant.weight.current}</h1>
                    </div>
                    <div className='info-div'>
                        <p>BF ( % ) Desejado </p>
                        <h1 className='info-red'>{participant.participant.weight.current}</h1>
                    </div>
                    <div className='info-div'>
                        <p>Frequencia Semanal </p>
                        <h1 className='info-red'>{participant.participant.attendanceDaysPerWeek}</h1>
                    </div>
                </div>
            ))}
        </div>        
    </div>
  );
}
