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

import { maskContainerStyle } from '@data-mapping/styler';

import type { SelectProps } from 'rc-select';
import type { IDraggingItem, IDropTarget } from '@data-mapping/_internal/dnd';
import type { IMappingSlotData, ISlotMaskRenderer } from '@data-mapping/_types';

export interface IMapSlotSelectOption {
  id: string;
  label: React.ReactNode;
}

export interface IMapSlotProps
  extends Required<Pick<SelectProps, 'tagRender'>>,
    Required<Pick<SelectProps, 'onSelect'>>,
    Required<Pick<SelectProps, 'onDeselect'>>,
    Required<Pick<SelectProps, 'onClear'>> {
  slotData: IMappingSlotData;
  selectOptions: {
    inSlot: IMapSlotSelectOption[];
    inFreeSlot: IMapSlotSelectOption[];
    inOtherSlot: IMapSlotSelectOption[];
  };
  maskRender: ISlotMaskRenderer;

  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;

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
  slotData,
  /** Antd SelectProps */
  tagRender,
  onSelect,
  onDeselect,
  onClear,
  /** end Antd SelectProps */
  selectOptions: { inSlot, inFreeSlot, inOtherSlot },
  maskRender,
  style = undefined,
  bodyStyle = undefined,
  droppable = undefined,
}) => {
  const { instanceId } = React.useContext(InstanceContext);

  const { id: slotId, label } = slotData;

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
        return { slotId, label };
      },
      collect: (monitor) => ({
        isDragging: monitor.getItem() !== null,
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [slotId, label, droppable],
  );

  const renderOption = ({
    id: optionId,
    label: optionLabel,
  }: IMapSlotSelectOption) => (
    <Select.Option key={optionId} value={optionId}>
      {optionLabel}
    </Select.Option>
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
        title={label}
        bordered
        size='small'
        style={style}
        bodyStyle={bodyStyle}
      >
        <Select
          value={inSlot.map((opt) => opt.id)}
          mode='multiple'
          maxTagCount='responsive'
          bordered={false}
          allowClear
          showArrow={false}
          onSelect={onSelect}
          onDeselect={onDeselect}
          onClear={onClear}
          style={{ width: '100%' }}
          tagRender={tagRender}
        >
          <Select.OptGroup label='已选择'>
            {inSlot.map(renderOption)}
          </Select.OptGroup>
          <Select.OptGroup label='未选择'>
            {inFreeSlot.map(renderOption)}
          </Select.OptGroup>
          <Select.OptGroup label='替换'>
            {inOtherSlot.map(renderOption)}
          </Select.OptGroup>
        </Select>
      </Card>
    </div>
  );
};
