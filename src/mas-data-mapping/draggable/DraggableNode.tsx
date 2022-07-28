/*
 * MIT License
 *
 * Copyright (c) 2022 ${company}
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react';

import { Tag } from 'antd';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { DragItemTypes, uniqueDragItemType } from '@data-mapping/_internal/dnd';
import InstanceContext from '@data-mapping/_internal/context';

import type { IDraggingItem, IDropTarget } from '@data-mapping/_internal/dnd';

import '@data-mapping/draggable/DraggableNode.css';

export interface IDraggableNodeProps {
  nodeId: string;
  label: React.ReactNode;
  selected: boolean;
  closable?: {
    onClose: () => void;
  };
  draggable?: {
    canDrag: boolean;
    isDragging: (draggingItem: IDraggingItem) => boolean;
    endDrag: (didDrop: boolean) => void;
  };
  onClick?: () => void;
}

interface ICollectedProps {
  isDragging: boolean;
}

export const DraggableNode: React.FC<IDraggableNodeProps> = ({
  nodeId,
  label,
  selected,
  closable = undefined,
  draggable = undefined,
  onClick = undefined,
}) => {
  const { instanceId } = React.useContext(InstanceContext);

  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag<
    IDraggingItem,
    IDropTarget,
    ICollectedProps
  >(
    () => ({
      type: uniqueDragItemType(DragItemTypes.TagNode, instanceId),
      item: {
        nodeId,
        type: DragItemTypes.TagNode,
        label,
        // sourceNode: { ...node, fromSlotId: slotId },
        // draggingNodes: selectedNodes.map((selectedNode) => ({
        //   fromSlotId: slotId,
        //   ...selectedNode,
        // })),
      },
      canDrag: () => (draggable === undefined ? false : draggable.canDrag),
      isDragging: (monitor) =>
        draggable === undefined
          ? false
          : draggable.isDragging(monitor.getItem()),
      end: draggable
        ? (_, monitor) => draggable.endDrag(monitor.didDrop())
        : undefined,
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }),
    [instanceId, nodeId, draggable],
  );

  React.useEffect(() => {
    dragPreviewRef(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreviewRef]);

  let tagClassName = 'mas-data-mapping-tag-node';
  if (selected) {
    tagClassName += ' mas-data-mapping-tag-node-selected';
  }

  return (
    <div ref={dragRef} style={{ opacity: isDragging ? 0 : 1 }}>
      <Tag
        key={nodeId}
        className={tagClassName}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onClick}
        closable={closable !== undefined}
        onClose={closable?.onClose}
      >
        {label}
      </Tag>
    </div>
  );
};
