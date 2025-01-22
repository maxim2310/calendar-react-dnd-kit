import dayjs from "dayjs";

export type Day = {
  date: dayjs.Dayjs;
  isCurrentMonth: boolean;
}