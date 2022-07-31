/*
 * MIT License
 *
 * Copyright (c) 2022 Chongyi Xu
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
import { useDrop } from 'react-dnd';

import maskContainerStyle from '@data-mapping/droppable/style';
import { DragItemTypes, uniqueDragItemType } from '@data-mapping/_internal/dnd';
import InstanceContext from '@data-mapping/_internal/context';

import type { ISlotMaskRenderer, ISlotStyler } from '@data-mapping/_types';
import type { IDraggingItem, IDropTarget } from '@data-mapping/_internal/dnd';

export interface IFreeSlotProps {
  label: React.ReactNode;
  childNodes: React.ReactNode[];

  maskRender: ISlotMaskRenderer;

  slotStyler: ISlotStyler;
  bodyStyle?: React.CSSProperties;

  droppable?: {
    onDrop: (item: IDraggingItem) => void;
  };
}

interface IDndCollected {
  isDragging: boolean;
  isOver: boolean;
  canDrop: boolean;
}

export const FreeSlot: React.FC<IFreeSlotProps> = ({
  label,
  childNodes,
  maskRender,
  slotStyler,
  bodyStyle = undefined,
  droppable = undefined,
}) => {
  const { instanceId } = React.useContext(InstanceContext);

  const [{ isOver, canDrop, isDragging }, dropRef] = useDrop<
    IDraggingItem,
    IDropTarget,
    IDndCollected
  >(
    () => ({
      accept: uniqueDragItemType(DragItemTypes.TagNode, instanceId),
      canDrop: () => droppable !== undefined,
      drop: (item) => {
        if (droppable) {
          droppable.onDrop(item);
        }
        return { slotId: `${instanceId}@free-slot`, label };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        isDragging: monitor.getItem() !== null,
      }),
    }),
    [droppable],
  );

  const mask = React.useMemo(
    () => maskRender({ slot: 'free-slot', canDrop, isDragging, isOver }),
    [maskRender, canDrop, isDragging, isOver],
  );

  return (
    <div ref={dropRef} className='mas-data-mapping-slot'>
      <div className='mas-data-mapping-slot-mask' style={maskContainerStyle}>
        {mask}
      </div>
      <Card
        className='mas-data-mapping-slot-card'
        title={label}
        bordered
        size='small'
        style={{
          ...slotStyler({ slot: 'free-slot', isDragging, canDrop, isOver }),
          zIndex: 6,
        }}
        bodyStyle={{ ...bodyStyle, zIndex: 6 }}
      >
        <Space wrap size={4}>
          {childNodes}
        </Space>
      </Card>
    </div>
  );
};
