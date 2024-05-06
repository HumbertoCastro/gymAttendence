// Define the JSON structure types
export interface DateAttendance {
    dates: string[];
    attended: string[];
  }
  
  export interface Month {
    monthName: string;
    weaks: { [week: string]: DateAttendance };
  }
  
  export interface GymAttendanceData {
    name: string;
    participant: {
      attendanceDaysPerWeek: number;
      weight: {
        current: number;
        desired: number;
      };
      bodyFatPercentage: {
        current: number;
        desired: number;
      };
    };
    frequency: { [year: string]: Month[] };
  }
  
  