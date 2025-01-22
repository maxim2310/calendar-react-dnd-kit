import styled from 'styled-components';
import { Task } from '../models/Task';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ItemTypes } from '../models/ItemTypesEnum';
import { useState } from 'react';

type DraggableTaskProps = {
  task: Task;
  onEditTask: (taskId: string, newText: string) => void;
};

const TaskEl = styled.div`
  background-color: #d3e5ff;
  border: 1px solid #007bff;
  padding: 4px;
  margin: 4px 0;
  border-radius: 4px;
  cursor: grab;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 4px;
  margin-top: 4px;
`;

export default function DraggableTask({
  task,
  onEditTask,
}: DraggableTaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: ItemTypes.TASK, task } });

  const style = {
    transition,
    transform3D: CSS.Transform.toString(transform),
  };

  if (task.isPublicHoliday) {
    return <TaskEl>{task.text}</TaskEl>;
  }

  if (isDragging) {
    return (
      <TaskEl ref={setNodeRef} style={{ ...style, opacity: '0.5' }}>
        drop here...
      </TaskEl>
    );
  }

  const handleEditTask = () => {
    setIsEditing(false);    
    onEditTask(task.id, newText);
  };

  return (
    <TaskEl ref={setNodeRef} style={style} {...attributes} {...listeners}  onClick={() => setIsEditing(true)}
>
      {isEditing ? (
        <Input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onBlur={handleEditTask}
          onKeyDown={(e) => e.key === 'Enter' && handleEditTask()}
          autoFocus
        />
      ) : (
        task.text
      )}
    </TaskEl>
  );
}
