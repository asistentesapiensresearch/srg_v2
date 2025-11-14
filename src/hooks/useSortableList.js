import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
} from "@dnd-kit/sortable";

export function useSortableList(items, setItems, onReorder) {

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        })
    );

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;

        setItems((prev) => {
            const oldIndex = prev.findIndex((i) => i.id === active.id);
            const newIndex = prev.findIndex((i) => i.id === over.id);

            const ordered = arrayMove(prev, oldIndex, newIndex);

            // reasignar índices automáticamente
            const withIndex = ordered.map((item, index) => ({
                ...item,
                index,
            }));

            // Avisar al componente padre (guardar backend)
            if (onReorder) onReorder(withIndex);

            return withIndex;
        });
    };

    return {
        dndContextProps: {
            sensors,
            collisionDetection: closestCenter,
            onDragEnd: handleDragEnd,
        },
        sortableContextProps: {
            items: items.map(i => i.id),
            strategy: rectSortingStrategy,
        }
    };
}