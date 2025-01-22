import { useMemo, useState } from 'react';
import styled from 'styled-components';
import DraggableTask from './DraggableTask';
import { Day } from '../models/Day';
import { Task } from '../models/Task';
import { SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { ItemTypes } from '../models/ItemTypesEnum';
import { PublicHoliday } from '../models/PublicHoliday';
import HolidayItem from './HolidayItem';
import dayjs from 'dayjs';
import { CalendarMode } from '../models/ModeEnum';

const CalendarCell = styled.div`
  border: 1px solid #ccc;
  padding: 8px;
  min-height: 100px;
  position: relative;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  padding: 4px;
  margin-top: 4px;
`;

const Button = styled.button<{ active?: boolean }>`
  margin-top: auto;
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

type CellProps = {
  day: Day;
  tasks: Task[];
  mode: CalendarMode;
  holidays: PublicHoliday[];
  onAddTask: (taskText: string, day: Day) => void;
  onEditTask: (taskId: string, newText: string) => void;
};

export default function Cell({
  day,
  tasks,
  mode,
  holidays,
  onAddTask,
  onEditTask,
}: CellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTask, setNewTask] = useState('');

  const { setNodeRef, isOver } = useDroppable({
    id: day.date.format('YYYY-MMM-DD'),
    data: { type: ItemTypes.DAY, day },
  });


  const relevantTasks = useMemo(() => {
    return tasks.filter((task) => task.date.isSame(day.date, 'day'));
  }, [day, tasks]);

  const relevantTasksIds = useMemo(() => {
    return relevantTasks.map((task) => task.id);
  }, [relevantTasks]);

  const relevantHolidays = useMemo(() => {
    return holidays.filter((holiday) =>
      dayjs(holiday.date, 'YYYY-MM-DD').isSame(day.date, 'day')
    );
  }, [day, holidays]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask(newTask, day);
      setNewTask('');
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };

  return (
    <CalendarCell
      ref={setNodeRef}
      style={{
        backgroundColor: isOver
          ? '#e0ffe0'
          : day.isCurrentMonth && mode === CalendarMode.MONTH
            ? '#e3e5e6'
            : '#ebebeb',
      }}
    >
      <div>{day.date.format('D')}</div>

      {relevantHolidays.map((holiday) => (
        <HolidayItem key={holiday.name} holiday={holiday}></HolidayItem>
      ))}

      <SortableContext items={relevantTasksIds}>
        {relevantTasks.map((task) => (
          <DraggableTask key={task.id} task={task} onEditTask={onEditTask} />
        ))}
      </SortableContext>

      {isEditing ? (
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onBlur={handleAddTask}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          autoFocus
        />
      ) : (
        <Button onClick={() => setIsEditing(true)}>+ Add Task</Button>
      )}
    </CalendarCell>
  );
}
