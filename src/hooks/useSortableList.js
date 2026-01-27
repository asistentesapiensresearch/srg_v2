// src/hooks/useSortableList.js
import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const useSortableList = (items, setItems, schemaRegistry) => {
    const [activeId, setActiveId] = useState(null);
    const [overId, setOverId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Evita activar el drag accidentalmente
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // ==================== HELPERS ====================

    // Obtener todos los IDs (incluyendo hijos) para SortableContext
    const getAllIds = (nodes) => {
        let ids = [];
        nodes.forEach(node => {
            ids.push(node.id);
            if (node.children && node.children.length > 0) {
                ids = [...ids, ...getAllIds(node.children)];
            }
        });
        return ids;
    };

    // Encontrar un nodo por ID en el árbol
    const findNodeById = (nodes, id) => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children && node.children.length > 0) {
                const found = findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    // Encontrar el padre de un nodo
    const findParentNode = (nodes, targetId, parent = null) => {
        for (const node of nodes) {
            if (node.id === targetId) return parent;
            if (node.children && node.children.length > 0) {
                const found = findParentNode(node.children, targetId, node);
                if (found !== null) return found;
            }
        }
        return null;
    };

    // Verificar si un nodo es contenedor
    const isContainer = (nodeId) => {
        const node = findNodeById(items, nodeId);
        if (!node || !schemaRegistry) return false;
        const schema = schemaRegistry[node.type];
        return schema?.isContainer === true;
    };

    // Remover un nodo del árbol
    const removeNode = (nodes, idToRemove) => {
        return nodes
            .filter(node => node.id !== idToRemove)
            .map(node => ({
                ...node,
                children: node.children ? removeNode(node.children, idToRemove) : []
            }));
    };

    // Insertar un nodo en una posición específica
    const insertNode = (nodes, nodeToInsert, targetParentId, index) => {
        // Si no hay padre, insertar en la raíz
        if (!targetParentId) {
            const newItems = [...nodes];
            newItems.splice(index, 0, nodeToInsert);
            return newItems;
        }

        // Insertar dentro de un contenedor
        return nodes.map(node => {
            if (node.id === targetParentId) {
                const newChildren = [...(node.children || [])];
                newChildren.splice(index, 0, nodeToInsert);
                return { ...node, children: newChildren };
            }
            if (node.children) {
                return {
                    ...node,
                    children: insertNode(node.children, nodeToInsert, targetParentId, index)
                };
            }
            return node;
        });
    };

    // Obtener el array de hermanos de un nodo
    const getSiblings = (nodes, nodeId, parentId = null) => {
        if (!parentId) {
            return nodes;
        }
        const parent = findNodeById(nodes, parentId);
        return parent?.children || [];
    };

    // ==================== DRAG HANDLERS ====================

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;

        if (!over) {
            setOverId(null);
            return;
        }

        setOverId(over.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        setActiveId(null);
        setOverId(null);

        if (!over || active.id === over.id) return;

        const activeNode = findNodeById(items, active.id);
        const overNode = findNodeById(items, over.id);

        if (!activeNode || !overNode) return;

        // Encontrar los padres
        const activeParent = findParentNode(items, active.id);
        const overParent = findParentNode(items, over.id);

        const activeParentId = activeParent?.id || null;
        let targetParentId = overParent?.id || null;

        // 🔥 DECISIÓN: ¿Mover dentro del contenedor o al lado?
        // Si el nodo sobre el que estamos es un contenedor Y no es el padre actual,
        // entonces mover dentro de él
        if (isContainer(over.id) && over.id !== activeParentId) {
            targetParentId = over.id;
        }
        // 🔥 CASO ESPECIAL: Si soltamos sobre un elemento que NO es contenedor,
        // pero está en la raíz, mover a la raíz también
        else if (!isContainer(over.id) && !overParent) {
            targetParentId = null;
        }

        // Prevenir que un contenedor se mueva dentro de sí mismo o de sus hijos
        if (isDescendant(activeNode, over.id)) {
            console.warn('❌ No se puede mover un contenedor dentro de sí mismo');
            return;
        }

        // Si es el mismo padre, solo reordenar
        if (activeParentId === targetParentId) {
            const siblings = getSiblings(items, active.id, activeParentId);
            const oldIndex = siblings.findIndex(node => node.id === active.id);
            const newIndex = siblings.findIndex(node => node.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const reordered = arrayMove(siblings, oldIndex, newIndex);

                if (!targetParentId) {
                    // Reordenar en raíz
                    setItems(reordered);
                } else {
                    // Reordenar dentro del contenedor
                    setItems(updateChildren(items, targetParentId, reordered));
                }
            }
        } else {
            // 🔥 Mover a diferente contenedor o nivel
            // Obtener los hermanos del destino
            const targetSiblings = getSiblings(items, over.id, targetParentId);

            // Calcular el índice de inserción
            let insertIndex = targetSiblings.findIndex(node => node.id === over.id);

            // Si estamos moviendo dentro de un contenedor vacío
            if (targetParentId === over.id) {
                insertIndex = 0; // Insertar al inicio del contenedor
            }
            // Si no encontramos el índice, insertar al final
            else if (insertIndex === -1) {
                insertIndex = targetSiblings.length;
            }
            // Si encontramos el índice, insertar justo antes
            // (esto permite sacar elementos de contenedores)

            let newItems = removeNode(items, active.id);
            newItems = insertNode(newItems, activeNode, targetParentId, insertIndex);
            setItems(newItems);
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
        setOverId(null);
    };

    // Helper para verificar si un nodo es descendiente de otro
    const isDescendant = (parentNode, childId) => {
        if (!parentNode.children) return false;

        for (const child of parentNode.children) {
            if (child.id === childId) return true;
            if (isDescendant(child, childId)) return true;
        }
        return false;
    };

    // Helper para actualizar los hijos de un nodo
    const updateChildren = (nodes, parentId, newChildren) => {
        return nodes.map(node => {
            if (node.id === parentId) {
                return { ...node, children: newChildren };
            }
            if (node.children) {
                return {
                    ...node,
                    children: updateChildren(node.children, parentId, newChildren)
                };
            }
            return node;
        });
    };

    // ==================== RETURN ====================

    const dndContextProps = {
        sensors,
        collisionDetection: closestCenter,
        onDragStart: handleDragStart,
        onDragOver: handleDragOver,
        onDragEnd: handleDragEnd,
        onDragCancel: handleDragCancel,
    };

    const sortableContextProps = {
        items: getAllIds(items),
        strategy: verticalListSortingStrategy,
    };

    return {
        dndContextProps,
        sortableContextProps,
        activeId,
        overId,
    };
};