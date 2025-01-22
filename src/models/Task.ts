import dayjs from "dayjs";

export type Task = {
  id: string;
  text: string;
  date: dayjs.Dayjs
  isPublicHoliday: boolean
};
