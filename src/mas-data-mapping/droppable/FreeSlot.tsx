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

import { Card, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';

import { DraggableNode } from '@data-mapping/draggable/DraggableNode';
import { DragItemTypes, uniqueDragItemType } from '@data-mapping/dnd';
import { freeNodesSelector } from '@data-mapping/store/selector';
import { mapActions } from '@data-mapping/reducers/mapping.reducer';
import { FREE_SLOT_ID } from '@data-mapping/types';

import type { IDraggingItem, IDropTarget } from '@data-mapping/dnd';

import '@data-mapping/droppable/Slot.css';

export interface IFreeSlotProps {
  instanceId: string;
  description: React.ReactNode;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
}

export const FreeSlot: React.FC<IFreeSlotProps> = (props) => {
  const { instanceId, description, style, bodyStyle } = props;
  const freeNodes = useSelector(freeNodesSelector);

  const dispatch = useDispatch();

  const [{ isOver, canDrop }, dropRef] = useDrop<
    IDraggingItem,
    IDropTarget,
    { isOver: boolean; canDrop: boolean }
  >(() => ({
    accept: uniqueDragItemType(DragItemTypes.TagNode, instanceId),
    drop: (item) => {
      const { sourceNode, draggingNodes } = item;
      if (draggingNodes.length === 0) {
        dispatch(
          mapActions.removeNodeFromSlot({
            slotId: sourceNode.fromSlotId,
            nodeId: sourceNode.id,
          }),
        );
      } else {
        draggingNodes.forEach((draggingNode) =>
          dispatch(
            mapActions.removeNodeFromSlot({
              slotId: draggingNode.fromSlotId,
              nodeId: draggingNode.id,
            }),
          ),
        );
      }
      return { targetSlotId: FREE_SLOT_ID };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  let cardClassName = 'mas-data-mapping-slot-multiple';
  if (isOver && canDrop) {
    cardClassName += ' mas-data-mapping-slot-active';
  } else if (canDrop) {
    cardClassName += ' mas-data-mapping-slot-droppable';
  } else if (isOver) {
    cardClassName += ' mas-data-mapping-slot-not-droppable';
  }
  return (
    <div ref={dropRef}>
      <Card
        key={FREE_SLOT_ID}
        className={cardClassName}
        style={style}
        title={description}
        size="small"
        bodyStyle={bodyStyle}
      >
        <Space wrap size={4}>
          {freeNodes.map((node) => (
            <DraggableNode
              key={node.id}
              id={node.id}
              slotId={FREE_SLOT_ID}
              instanceId={instanceId}
              closable={false}
            />
          ))}
        </Space>
      </Card>
    </div>
  );
};
