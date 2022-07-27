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
export const FREE_SLOT_ID = 'mas-data-mapping-free-slot';

export interface IMappingNode {
  /**
   * @description A unique id to identify the node
   */
  id: string;

  /**
   * @description A label to represent the node
   */
  label: string;
}

export interface IMappingSlotBase {
  /**
   * @description A unique id to identify the slot
   */
  id: string;

  /**
   * @description A label to represent the slot
   */
  label: string;
}

export interface IMappingSlotExtend {
  /**
   * @description whether the slot allow multiple nodes in it
   * @default true
   */
  allowMultiple: boolean;

  /**
   * @description whether the slot is required
   * @default false
   */
  required: boolean;

  /**
   * @description whether the slot is visible at the beginning
   * @default true
   */
  visible: boolean;
}

export type IMappingSlot = IMappingSlotBase & IMappingSlotExtend;

export type IMappingObject = Record<string, string[]>; // key: slotId, value: nodeIds;
