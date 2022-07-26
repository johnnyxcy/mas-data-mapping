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
import type React from 'react';

import type { IDraggingItem } from '@data-mapping/_internal/dnd';
import type { MenuProps } from 'antd';

export interface IMappingNodeProps {
  /**
   * @description A unique id to identify the node
   */
  id: string;

  /**
   * @description A label to represent the node
   */
  label: React.ReactNode;
}

export type IMappingNodeData = Required<IMappingNodeProps>;

export interface IMappingSlotProps {
  /**
   * @description A unique id to identify the slot
   */
  id: string;

  /**
   * @description A label to represent the slot
   */
  label: React.ReactNode;

  /**
   * @description Slot allows multiple nodes in it
   * @default true
   */
  allowMultiple?: boolean;

  /**
   * @description Slot is required (cannot change visibility)
   * @default false
   */
  required?: boolean;

  /**
   * @description Slot is visible
   * @default true
   */
  visible?: boolean;
}

export type IMappingSlotData = Required<IMappingSlotProps>;

export type ISlotMaskRenderer = (props: {
  slot: IMappingSlotData | 'free-slot';
  isDragging: boolean;
  canDrop: boolean;
  isOver: boolean;
}) => React.ReactElement;

export type ISlotStyler = (props: {
  slot: IMappingSlotData | 'free-slot';
  isDragging: boolean;
  canDrop: boolean;
  isOver: boolean;
}) => React.CSSProperties;

export type ITagNodeStyler = (props: {
  node: IMappingNodeData;
  selected: boolean;
}) => React.CSSProperties;

export type IDraggingItemRenderer = (props: {
  draggingSource: IDraggingItem;
  selectedNodes: IMappingNodeData[];
}) => React.ReactElement;

export type IMappingObject = Record<string, string[]>;

export interface ISelectionOptionData {
  slot: IMappingSlotData;
  nodesInSlot: IMappingNodeData[];
}

export type ISlotSelectDropdownRenderer = (
  props: {
    currentSlot: ISelectionOptionData;
    otherSlots: ISelectionOptionData[];
    freeNodes: IMappingNodeData[];
  } & Pick<MenuProps, 'onSelect'> &
    Pick<MenuProps, 'onDeselect'>,
) => React.ReactElement;

export interface IDataMappingProps {
  /**
   * @description All nodes available to drag or choose
   */
  nodes: IMappingNodeProps[];

  /**
   * @description All slots available to drop or fill
   */
  slots: IMappingSlotProps[];

  /**
   * @description Pre-mapped object, key is the slot id and the value is the array of node ids
   * @default undefined
   */
  initialMapping?: IMappingObject;

  /**
   * @description Label for free slot
   * @default "Available"
   */
  freeSlotLabel?: React.ReactNode;

  /**
   * @description Callback on map object changed
   * @default undefined
   */
  onMappingChange?: (mapping: IMappingObject) => void;

  /**
   * @description Whether to show hidden slot
   * @default false
   */
  showHidden?: boolean;

  /**
   * @description Callback on slot visibility changed
   * @default undefined
   */
  onVisibleChange?: (slotId: string, visible: boolean) => void;

  /**
   * @description Render slot mask
   */
  slotMaskRenderer?: ISlotMaskRenderer;

  /**
   * @description Style tag node
   */
  tagNodeStyler?: ITagNodeStyler;

  /**
   * @description Render slot select dropdown
   */
  selectDropdownRenderer?: ISlotSelectDropdownRenderer;
}
