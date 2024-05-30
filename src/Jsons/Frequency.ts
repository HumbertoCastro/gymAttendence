// Define the JSON structure types
export interface DateAttendance {
    dates: string[];
    attended: string[];
    compesatedDays: string[];
  }
  
  export interface Month {
    monthName: string;
    weaks: { [week: string]: DateAttendance };
  }

  export interface Participant {
    attendanceDaysPerWeek: number;
    weight: {
      current: number;
      desired: number;
    };
    bodyFatPercentage: {
      current: number;
      desired: number;
    };
  }
  
  export interface GymAttendanceData {
    name: string;
    extraDaysUsed: string[];
    participant: Participant;
    frequency: { [year: string]: Month[] };
  }