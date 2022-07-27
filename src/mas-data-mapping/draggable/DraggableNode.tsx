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
import { useDispatch, useSelector } from 'react-redux';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { DragItemTypes, uniqueDragItemType } from '@data-mapping/dnd';
import {
  nodeSelector,
  nodesInSlotSelector,
  selectionSelector,
} from '@data-mapping/store/selector';
import { selectionActions } from '@data-mapping/reducers/select.reducer';
import { mapActions } from '@data-mapping/reducers/mapping.reducer';

import type { IDraggingItem, IDropTarget } from '@data-mapping/dnd';

import '@data-mapping/draggable/DraggableNode.css';

export interface IDraggableNodeProps {
  id: string;
  slotId: string;
  instanceId: string;
  closable?: boolean;
}

interface ICollectedProps {
  isDragging: boolean;
}

export const DraggableNode: React.FC<IDraggableNodeProps> = (props) => {
  const { id: nodeId, slotId, closable, instanceId } = props;

  const node = useSelector(nodeSelector(nodeId));
  if (node === undefined) {
    throw new Error('Node not found');
  }
  const nodesInSlot = useSelector(nodesInSlotSelector(slotId));
  const { selectedNodes } = useSelector(selectionSelector);
  const isSelected = !!selectedNodes.find(
    (selectedNode) => selectedNode.id === nodeId,
  );

  const dispatch = useDispatch();

  // const [isSelected, setSelected] = React.useState<boolean>(false);

  // const clickEventTypeRef = React.useRef<'onMouseDown' | 'onMouseUp'>(
  //   'onMouseUp',
  // );

  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag<
    IDraggingItem,
    IDropTarget,
    ICollectedProps
  >(
    () => ({
      type: uniqueDragItemType(DragItemTypes.TagNode, instanceId),
      item: {
        sourceNode: { ...node, fromSlotId: slotId },
        draggingNodes: selectedNodes.map((selectedNode) => ({
          fromSlotId: slotId,
          ...selectedNode,
        })),
      },
      canDrag: () => {
        return isSelected || selectedNodes.length === 0;
      },
      isDragging: (monitor) => {
        const { sourceNode } = monitor.getItem();
        return (
          isSelected ||
          (selectedNodes.length === 0 && sourceNode.id === node.id)
        );
      },
      end: () => {
        dispatch(selectionActions.clearSelection());
      },
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }),
    [node, nodeId, slotId, selectedNodes, isSelected, instanceId],
  );

  React.useEffect(() => {
    dragPreviewRef(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreviewRef]);

  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      dispatch(
        selectionActions.toggleNodeSelection({
          node,
          nodesInSameSlot: nodesInSlot,
        }),
      );
      e.stopPropagation();
    },
    [dispatch, node, nodesInSlot],
  );

  // const onMouseUp = React.useCallback(
  //   (e: React.MouseEvent<HTMLSpanElement>) => {
  //     if (clickEventTypeRef.current !== 'onMouseUp') {
  //       setSelected(!isSelected);
  //       dispatch(
  //         actions.changeNodeSelection({
  //           nodeId,
  //           type: isSelected ? 'deselect' : 'select',
  //         }),
  //       );
  //     } else {
  //       console.log('NOT CLICK');
  //     }
  //     e.stopPropagation();
  //   },
  //   [clickEventTypeRef, nodeId, isSelected, setSelected, dispatch],
  // );

  const onClose = React.useCallback(() => {
    dispatch(mapActions.removeNodeFromSlot({ nodeId, slotId }));
    if (selectedNodes.length > 0) {
      dispatch(selectionActions.clearSelection());
    }
  }, [dispatch, nodeId, slotId, selectedNodes]);

  let tagClassName = 'mas-data-mapping-tag-node';
  if (isSelected) {
    tagClassName += ' mas-data-mapping-tag-node-selected';
  }

  return (
    <div ref={dragRef} style={{ opacity: isDragging ? 0 : 1 }}>
      <Tag
        key={nodeId}
        className={tagClassName}
        onClose={onClose}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onClick}
        // onMouseUp={onMouseUp}
        closable={closable}
      >
        {node.label}
      </Tag>
    </div>
  );
};
