import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import Cell from './Cell';
import {
  debounce,
  filterTasks,
  generateDays,
  generateDaysForCurrentWeek,
  getIdFromDateJs,
  swapElements,
} from '../utils/helper';
import { Task } from '../models/Task';
import { Day } from '../models/Day';
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import DraggableTask from './DraggableTask';
import { ItemTypes } from '../models/ItemTypesEnum';
import { apiService } from '../services/ApiService';
import { PublicHoliday } from '../models/PublicHoliday';
import CalendarHeader from './CalendarHeader';
import { CalendarMode } from '../models/ModeEnum';

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  padding: 16px;
`;

const WeekDay = styled.div`
  padding: 8px 0;
  text-transform: capitalize;
  display: flex;
  justify-content: center;
  font-weight: bold;
  color: #878c92;
`;

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [currentMode, setCurrentMode] = useState(CalendarMode.MONTH);
  const [days, setDays] = useState(generateDays(currentDate));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [filterValue, setFilterValue] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const currentYear = useMemo(() => {
    return currentDate.get('year');
  }, [currentDate]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const holidays = (
          await apiService.getPublicHolidays(currentYear)
        ).filter((holiday) => holiday.global);

        setHolidays(holidays);
      } catch (error) {
        console.error('Failed to fetch public holidays:', error);
      }
    };

    fetchHolidays();
  }, [currentYear]);

  useEffect(() => {
    if (currentMode === CalendarMode.MONTH) {
      setDays(generateDays(currentDate));
    } else {
      setDays(generateDaysForCurrentWeek(currentDate));
    }
  }, [currentDate, currentMode]);

  useEffect(() => {
    const result = filterTasks(tasks, filterValue);
    setFilteredTasks(result);
  }, [tasks]);

  const handleAddTask = (taskText: string, day: Day) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        id: getIdFromDateJs(dayjs()),
        text: taskText,
        date: dayjs(day.date),
        isPublicHoliday: false,
      },
    ]);
  };

  const handleEditTask = (taskId: string, newText: string) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, text: newText } as Task;
        }

        return task;
      });
    });
  };

  const handleDateChange = (offset: number) => {
    const newDate = currentDate.add(offset, currentMode);
    setCurrentDate(newDate);
  };

  const handleModeChange = (mode: CalendarMode) => {
    setCurrentMode(mode);
  };

  const onDragStart = (event: DragStartEvent) => {
    console.log('DRAG START', event);

    if (event.active.data.current?.type === ItemTypes.TASK) {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = () => {};

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !active) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) {
      return;
    }

    const isActiveTask = active.data.current?.type === ItemTypes.TASK;
    const isOverTask = over.data.current?.type === ItemTypes.TASK;

    if (!isActiveTask) {
      return;
    }

    //dropping task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);
        const overIndex = tasks.findIndex((task) => task.id === overId);

        tasks[activeIndex].date = tasks[overIndex].date;

        return swapElements(tasks, activeIndex, overIndex);
      });
    }

    //dropping a task over another day cell
    const isOverDay = over.data.current?.type === ItemTypes.DAY;

    if (isActiveTask && isOverDay) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);

        tasks[activeIndex].date = over.data.current?.day.date;

        return swapElements(tasks, activeIndex, activeIndex);
      });
    }
  };

  const filterTasksDebounce = useCallback(
    debounce((value: string) => {
      const result = filterTasks(tasks, value);

      setFilteredTasks(result);
    }, 300),
    [tasks]
  );

  const handleInputChange = (value: string) => {
    setFilterValue(value);
    filterTasksDebounce(value);
  };

  return (
    <>
      <CalendarHeader
        date={currentDate}
        mode={currentMode}
        onDateChange={handleDateChange}
        onModeChange={handleModeChange}
        filterValue={filterValue}
        setFilterValue={handleInputChange}
      ></CalendarHeader>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <CalendarContainer>
          {daysOfWeek.map((day) => (
            <WeekDay key={day}>{day}</WeekDay>
          ))}
          {days.map((day) => (
            <Cell
              key={getIdFromDateJs(day.date)}
              day={day}
              tasks={filteredTasks}
              holidays={holidays}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              mode={currentMode}
            />
          ))}
        </CalendarContainer>
        {createPortal(
          <DragOverlay>
            {activeTask && (
              <DraggableTask
                key={activeTask.id}
                task={activeTask}
                onEditTask={handleEditTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </>
  );
}
