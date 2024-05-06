import { DateAttendance } from "../Jsons/Frequency";

interface SortedWeeks {
    [key: string]: DateAttendance;
  }

export function sortWeeks(data: any): SortedWeeks {
    // Extract keys and sort them based on the numeric part of the "Semana N"
    const sortedKeys = Object.keys(data).sort((a, b) => {
        const weekNumberA = parseInt(a.split(' ')[1], 10);
        const weekNumberB = parseInt(b.split(' ')[1], 10);
        return weekNumberA - weekNumberB;
    });
    const sortedData: any = {};
    sortedKeys.forEach(key => {
        sortedData[key] = data[key];
    });

    return sortedData;
}