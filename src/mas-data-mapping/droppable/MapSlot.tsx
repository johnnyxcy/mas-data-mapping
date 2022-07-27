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

import { Card, Select, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';

import { mapActions } from '@data-mapping/reducers/mapping.reducer';
import {
  dataSelector,
  nodeIdsInSlotSelector,
  slotSelector,
} from '@data-mapping/store/selector';
import { DraggableNode } from '@data-mapping/draggable/DraggableNode';
import { DragItemTypes, uniqueDragItemType } from '@data-mapping/dnd';

import type { IDraggingItem, IDropTarget } from '@data-mapping/dnd';

import '@data-mapping/droppable/Slot.css';

export interface IMapSlotProps {
  id: string;
  instanceId: string;
}

interface IDndCollected {
  isOver: boolean;
  canDrop: boolean;
}

export const MapSlot: React.FC<IMapSlotProps> = (props) => {
  const { id: slotId, instanceId } = props;

  const { nodes } = useSelector(dataSelector);
  const slot = useSelector(slotSelector(slotId));
  if (slot === undefined) {
    throw new Error('Slot not found');
  }
  const dispatch = useDispatch();

  const [{ isOver, canDrop }, dropRef] = useDrop<
    IDraggingItem,
    IDropTarget,
    IDndCollected
  >(
    () => ({
      accept: uniqueDragItemType(DragItemTypes.TagNode, instanceId),
      canDrop: (item) => {
        if (!slot.allowMultiple && item.draggingNodes.length > 1) {
          return false;
        }
        return true;
      },
      drop: (item) => {
        const { sourceNode, draggingNodes } = item;
        if (draggingNodes.length === 0) {
          dispatch(mapActions.setToSlot({ slot, nodeIdOrIds: sourceNode.id }));
        } else {
          draggingNodes.forEach((draggingNode) =>
            dispatch(
              mapActions.setToSlot({ slot, nodeIdOrIds: draggingNode.id }),
            ),
          );
        }
        return { targetSlotId: slotId };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [dispatch, slotId, slot],
  );

  const onSelect = React.useCallback(
    (nodeId: string) => {
      dispatch(mapActions.setToSlot({ nodeIdOrIds: nodeId, slot }));
    },
    [dispatch, slot],
  );

  const onDeselect = React.useCallback(
    (nodeId: string) => {
      dispatch(mapActions.removeNodeFromSlot({ nodeId, slotId }));
    },
    [dispatch, slotId],
  );

  const onClear = React.useCallback(() => {
    // dispatch(actions.clearNodesInSlot({ slotId }));
    dispatch(mapActions.clearNodesInSlot({ slotId }));
  }, [dispatch, slotId]);

  let cardClassName = `mas-data-mapping-slot-${
    slot.allowMultiple ? 'multiple' : 'single'
  }`;
  if (isOver && canDrop) {
    cardClassName += ' mas-data-mapping-slot-active';
  } else if (canDrop) {
    cardClassName += ' mas-data-mapping-slot-droppable';
  } else if (isOver) {
    cardClassName += ' mas-data-mapping-slot-not-droppable';
  }

  const nodeInSlots = useSelector(nodeIdsInSlotSelector(slotId));

  return (
    <div ref={dropRef}>
      <Card
        key={slotId}
        className={cardClassName}
        title={
          slot.required ? (
            <span>
              {slot.label}
              <Typography.Text style={{ fontWeight: 'bold', color: 'red' }}>
                {' '}
                *
              </Typography.Text>
            </span>
          ) : (
            slot.label
          )
        }
        bordered
        size="small"
      >
        <Select
          value={nodeInSlots}
          mode="multiple"
          maxTagCount="responsive"
          bordered={false}
          allowClear
          showArrow={false}
          onSelect={onSelect}
          onDeselect={onDeselect}
          onClear={onClear}
          style={{ width: '100%' }}
          // eslint-disable-next-line react/no-unstable-nested-components
          tagRender={({ value }) => (
            <DraggableNode
              id={value}
              slotId={slotId}
              instanceId={instanceId}
              closable
            />
          )}
        >
          {nodes.map((node) => (
            <Select.Option key={node.id} value={node.id}>
              {node.label}
            </Select.Option>
          ))}
          {/* <Select.OptGroup label="已选择">{[]}</Select.OptGroup>
          <Select.OptGroup label="未选择">{[]}</Select.OptGroup>
          <Select.OptGroup label="替换">{[]}</Select.OptGroup> */}
        </Select>
      </Card>
    </div>
  );
};
