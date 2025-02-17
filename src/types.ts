export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  content: string;
  timestamp: Date;
}

export interface ScheduleChangeRequest {
  id: string;
  teacherName: string;
  content: string;
  timestamp: Date;
}

export interface ClassSlot {
  startTime: string;
  endTime: string;
  subject?: string;
  teacher?: string;
  room?: string;
}

export interface DaySchedule {
  day: string;
  slots: ClassSlot[];
  classTest?: {
    subject?: string;
    teacher?: string;
    room?: string;
  };
}