import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { GymAttendanceData } from '../Jsons/Frequency';
import { getAllJsons } from '../firebase-config';
import Participant from '../components/Participant';

export default function GeneralInfo() {
    const [data, setData] = useState<GymAttendanceData[]>([]);
    const widthScream = window.innerWidth;
    const heighScream = window.innerHeight;
    const [chartData, setChartData] = useState<any>({ labels: [], values: [] });
    const [allDays, setAllDays] = useState<any>({ labels: [], values: [] });

    const getjsons = async () => {
        const jsonData: any = await getAllJsons();
        if (jsonData) setData(jsonData as GymAttendanceData[]);
    };

    useEffect(() => {
        getjsons();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const persons: number[] = [];
            const labels = data.map(item => item.name);
            const values = data.map(item => {
                let count = 0;
                let personCount = 0;
                Object.values(item.frequency).forEach(month => {
                    month.forEach(m => {
                        Object.values(m.weaks).forEach(week => {
                            if (week.attended.length >= item.participant.attendanceDaysPerWeek) {
                                count++;
                            }
                            personCount += week.attended.length;
                        });
                    });
                });
                persons.push(personCount);
                return count;
            });

            const combinedData = labels.map((label, index) => ({
                label,
                value: persons[index]
            }));

            combinedData.sort((a, b) => b.value - a.value);

            const sortedLabels = combinedData.map(item => item.label);
            const sortedValues = combinedData.map(item => item.value);

            setAllDays({ labels: sortedLabels, values: sortedValues });
            setChartData({ labels, values });
        }
    }, [data]);

    return (
        <div className='table-cont'>
            <h1>Frequência Geral</h1>
            <p>Semanas Acima ou igual a meta</p>
            {chartData.labels.length > 0 && (
                <BarChart
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '6px'
                    }}
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
            <h1>Frequência Geral em numero de DIAS</h1>
            <p>Quantos dias cada um foi a academia</p>
            {allDays.labels.length > 0 && (
                <BarChart
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '6px'
                    }}
                    xAxis={[{
                        id: 'barCategories',
                        data: allDays.labels,
                        scaleType: 'band'
                    }]}
                    yAxis={[{
                        id: 'yAxis1',
                        position: 'left',
                        scaleType: 'linear',
                        max: 54
                    }]}
                    series={[{
                        data: allDays.values,
                    }]}
                    width={widthScream * 0.95}
                    height={heighScream * 0.6}
                />
            )}
            <div className="participant-goals">
                <h2>Meta de todos os Participantes</h2>
                {data.map(participant => <Participant participant={participant} key={participant.name} /> )}
            </div>
        </div>
    );
}
