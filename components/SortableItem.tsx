import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({
  id,
  children,
  name,
  quantity,
}: {
  id: number;
  children?: React.ReactNode;
  name: string;
  quantity: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li className="flex justify-between items-center p-2 bg-gray-100 rounded">
      {/* Zone Drag-and-Drop */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="cursor-move flex-grow"
      >
        {name} - {quantity}
      </div>

      {/* Zone des boutons */}
      <div className="flex gap-2">
        {children}
      </div>
    </li>
  );
}
