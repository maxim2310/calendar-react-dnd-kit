import styled from 'styled-components';
import { PublicHoliday } from '../models/PublicHoliday';

type HolidayItemProps = { holiday: PublicHoliday };

const TaskEl = styled.div`
  background-color: #d3e5ff;
  border: 1px solid #007bff;
  padding: 4px;
  margin: 4px 0;
  border-radius: 4px;
  cursor: grab;
  text-align: center
`;

export default function HolidayItem({ holiday }: HolidayItemProps) {


  return (
    <TaskEl >
      {holiday.name}
    </TaskEl>
  );
}