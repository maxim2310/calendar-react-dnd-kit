import dayjs from 'dayjs';
import styled from 'styled-components';
import { CalendarMode } from '../models/ModeEnum';

const Header = styled.div`
  padding: 4px;
  margin: 4px 0 10px;
  display: flex;
  justify-content: space-between;
`;

const Title = styled.p`
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const FilterButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{ active?: boolean }>`
  background-color: ${(props) => (props.active ? '#ddd' : '#f9f9f9')};
  border: 1px solid ${(props) => (props.active ? '#bbb' : '#ccc')};
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  &:hover {
    background-color: #eee;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 4px;
  margin-right: 10px;
`;

type CalendarHeaderProps = {
  date: dayjs.Dayjs;
  mode: CalendarMode;
  onDateChange: (direction: number) => void;
  onModeChange: (mode: CalendarMode) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
};

export default function CalendarHeader({
  date,
  mode,
  onDateChange,
  onModeChange,
  filterValue,
  setFilterValue,
}: CalendarHeaderProps) {
  return (
    <Header>
      <div>
        <ButtonGroup>
          <Button onClick={() => onDateChange(-1)}>Previous</Button>
          <Button onClick={() => onDateChange(1)}>Next</Button>
        </ButtonGroup>
      </div>
      <Title>{date.format('MMMM YYYY')}</Title>
      <FilterButtonWrapper>
        <Input
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        ></Input>
        <ButtonGroup>
          <Button
            active={mode === CalendarMode.WEEK}
            onClick={() => onModeChange(CalendarMode.WEEK)}
          >
            Week
          </Button>
          <Button
            active={mode === CalendarMode.MONTH}
            onClick={() => onModeChange(CalendarMode.MONTH)}
          >
            Month
          </Button>
        </ButtonGroup>
      </FilterButtonWrapper>
    </Header>
  );
}
