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

import { Card, Select } from 'antd';
import { useDrop } from 'react-dnd';

import InstanceContext from '@data-mapping/_internal/context';
import { DragItemTypes, uniqueDragItemType } from '@data-mapping/_internal/dnd';

import maskContainerStyle from '@data-mapping/droppable/style';

import type { SelectProps } from 'rc-select';
import type { IDraggingItem, IDropTarget } from '@data-mapping/_internal/dnd';
import type {
  IMappingNodeData,
  IMappingSlotData,
  ISlotMaskRenderer,
  ISlotStyler,
} from '@data-mapping/_types';

export interface IMapSlotSelectOption {
  id: string;
  label: React.ReactNode;
}

export interface IMapSlotProps
  extends Required<Pick<SelectProps, 'tagRender'>>,
    Required<Pick<SelectProps, 'onClear'>> {
  nodesInSlotData: IMappingNodeData[];
  slotData: IMappingSlotData;
  dropdownMenu: React.ReactElement;
  maskRender: ISlotMaskRenderer;
  slotStyler: ISlotStyler;

  droppable?: {
    canDrop: (item: IDraggingItem) => boolean;
    onDrop: (item: IDraggingItem) => void;
  };
}

interface IDndCollected {
  isDragging: boolean;
  isOver: boolean;
  canDrop: boolean;
}

export const MapSlot: React.FC<IMapSlotProps> = ({
  nodesInSlotData,
  slotData,
  /** Antd SelectProps */
  tagRender,
  onClear,
  /** end Antd SelectProps */
  maskRender,
  slotStyler,
  dropdownMenu,
  droppable = undefined,
}) => {
  const { instanceId } = React.useContext(InstanceContext);

  const { id: slotId, label: slotLabel } = slotData;

  const [{ isDragging, isOver, canDrop }, dropRef] = useDrop<
    IDraggingItem,
    IDropTarget,
    IDndCollected
  >(
    () => ({
      accept: uniqueDragItemType(DragItemTypes.TagNode, instanceId),
      canDrop: droppable ? droppable.canDrop : undefined,
      drop: (item) => {
        if (droppable) {
          droppable.onDrop(item);
        }
        return { slotId, label: slotLabel };
      },
      collect: (monitor) => ({
        isDragging: monitor.getItem() !== null,
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [slotId, slotLabel, droppable],
  );

  const mask = React.useMemo(
    () => maskRender({ slot: slotData, canDrop, isDragging, isOver }),
    [maskRender, slotData, canDrop, isDragging, isOver],
  );

  return (
    <div ref={dropRef} className='mas-data-mapping-slot'>
      <div className='mas-data-mapping-slot-mask' style={maskContainerStyle}>
        {mask}
      </div>
      <Card
        key={slotId}
        className='mas-data-mapping-slot-card'
        title={slotLabel}
        bordered
        size='small'
        style={slotStyler({ slot: slotData, isDragging, canDrop, isOver })}
      >
        <Select
          value={nodesInSlotData.map((opt) => opt.id)}
          mode='multiple'
          maxTagCount='responsive'
          disabled={!slotData.visible}
          bordered={false}
          allowClear
          showArrow={false}
          onClear={onClear}
          style={{ width: '100%' }}
          tagRender={tagRender}
          dropdownRender={() => dropdownMenu}
        />
      </Card>
    </div>
  );
};
