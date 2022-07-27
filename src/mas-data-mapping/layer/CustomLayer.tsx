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

import { Badge, Tag } from 'antd';
import { useDragLayer } from 'react-dnd';

import type { XYCoord } from 'react-dnd';
import type { IDraggingItem } from '@data-mapping/dnd';

interface ICollectedProps {
  item: IDraggingItem;
  isDragging: boolean;
  currentOffset: XYCoord | null;
}

const CustomLayer: React.FC = () => {
  const { item, isDragging, currentOffset } = useDragLayer<
    ICollectedProps,
    IDraggingItem
  >((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  const nSelected = item.draggingNodes.length;
  const label =
    nSelected <= 1 ? item.sourceNode.label : `选中了 ${nSelected} 个`;

  const transform = `translate(${currentOffset.x}px, ${currentOffset.y}px)`;

  return (
    <div
      style={{
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        position: 'fixed',
        zIndex: 100,
        left: 0,
        top: 0,
      }}
    >
      <div style={{ transform, WebkitTransform: transform }}>
        <Badge count={nSelected === 1 ? 0 : nSelected}>
          <Tag className="mas-data-mapping-tag-node mas-data-mapping-tag-node-selected">
            {label}
          </Tag>
        </Badge>
      </div>
    </div>
  );
};

export default CustomLayer;
