import dayjs from 'dayjs';
import { Day } from "../models/Day";
import { PublicHoliday } from '../models/PublicHoliday';
import { Task } from '../models/Task';


export const generateDays = (currentDate: dayjs.Dayjs): Day[] => {
  const days: Day[] = [];
  const firstDayOfMonth = currentDate.date(1);
  const lastDayOfMonth = currentDate.endOf('month');

  const prevMonthLastDay = firstDayOfMonth.subtract(1, 'month').endOf('month');
  const nextMonthStartDay = lastDayOfMonth.add(1, 'day');

  // Days from previous month
  const prevDaysCount = firstDayOfMonth.day();
  for (
    let i = prevMonthLastDay.date() - prevDaysCount + 2;
    i <= prevMonthLastDay.date();
    i++
  ) {
    days.push({
      date: prevMonthLastDay.set('date', i),
      isCurrentMonth: false,
    });
  }

  // Days of the current month
  for (let i = 1; i <= lastDayOfMonth.date(); i++) {
    days.push({
      date: firstDayOfMonth.set('date', i),
      isCurrentMonth: true,
    });
  }

  // Days from next month
  const nextDaysCount = 7 - (days.length % 7 || 7);
  for (let i = 1; i <= nextDaysCount; i++) {
    days.push({
      date: nextMonthStartDay.set('date', i),
      isCurrentMonth: false,
    });
  }

  return days;
};

export const generateDaysForCurrentWeek = (currentDate: dayjs.Dayjs): Day[] => {
  const days: Day[] = [];

  const startOfWeek = currentDate.startOf("week").add(1, "day");
  const endOfWeek = startOfWeek.add(6, "day");

  for (let date = startOfWeek; date.isBefore(endOfWeek.add(1, "day")); date = date.add(1, "day")) {
    days.push({
      date,
      isCurrentMonth: date.isSame(currentDate, "month"),
    });
  }

  return days;
}

export const swapElements = <T>(array: T[], activeIndex: number, overIndex: number): T[] => {
  const newArray = [...array];
  
  if (
    activeIndex >= 0 &&
    overIndex >= 0 &&
    activeIndex < array.length &&
    overIndex < array.length
  ) {
    [newArray[activeIndex], newArray[overIndex]] = [newArray[overIndex], newArray[activeIndex]];
  }
  
  return newArray;
}

export const getIdFromDateJs = (date: dayjs.Dayjs) => {
  return date.format('YYYY-MMM-DD hh:mm:ss:SSS')
}

export const sanitizeHolidays = (holiday: PublicHoliday): Task => {
  const {date, name} = holiday
  const dayJsDate = dayjs(date, "YYYY-MM-DD")
  return {id: getIdFromDateJs(dayJsDate), text: name, date: dayJsDate, isPublicHoliday: true}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void => {
  let timer: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export const filterTasks = (tasks: Task[], searchTerm: string) => {
  
  const result = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return result
}
