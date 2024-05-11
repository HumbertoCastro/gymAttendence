import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { GymAttendanceData } from '../Jsons/Frequency';
import { getAllJsons } from '../firebase-config';
import Participant from '../components/Participant';

export default function GeneralInfo() {
    const [data, setData] = useState<GymAttendanceData[]>([]);
    const widthScream = window.innerWidth
    const heighScream = window.innerHeight
    const [chartData, setChartData] = useState<any>({ labels: [], values: [] });

    const getjsons = async () => {
        const jsonData: any = await getAllJsons();
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
        <h1>Frequência Geral</h1>
        <p>Semanas Acima ou igual a meta</p>
        {chartData.labels.length > 0 && (
            <BarChart
                sx={
                {
                    backgroundColor: 'white',
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
            <h2>Meta de todos os Participantes</h2>
            {data.map(participant => <Participant participant={participant} /> )}
        </div>        
    </div>
  );
}
