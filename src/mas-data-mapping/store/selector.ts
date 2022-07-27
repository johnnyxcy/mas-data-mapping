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
import type { IMappingNode, IMappingSlot } from '@data-mapping/types';
import { FREE_SLOT_ID } from '@data-mapping/types';
import type { RootState } from '@data-mapping/store/root.store';
import type { IMasDataMappingSelection } from '@data-mapping/reducers/select.reducer';
import type { IMasDataMappingMap } from '@data-mapping/reducers/mapping.reducer';
import type { IMasDataMappingData } from '@data-mapping/reducers/data.reducer';
import type { Selector } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

export const dataSelector: Selector<RootState, IMasDataMappingData> = (state) =>
  state.data;
export const mappingSelector: Selector<RootState, IMasDataMappingMap> = (
  state,
) => state.mapping;
export const selectionSelector: Selector<
  RootState,
  IMasDataMappingSelection
> = (state) => state.selection;

export const freeNodesSelector: Selector<RootState, IMappingNode[]> =
  createSelector([dataSelector, mappingSelector], (data, mapping) => {
    let freeNodes = [...data.nodes];
    for (const mappedNodeIds of Object.entries(mapping).values()) {
      freeNodes = freeNodes.filter(
        (node) => mappedNodeIds.indexOf(node.id) === -1,
      );
    }

    return freeNodes;
  });

export const nodeSelector: (
  nodeId: string,
) => Selector<RootState, IMappingNode | undefined> = (nodeId) =>
  createSelector([dataSelector], (data) =>
    data.nodes.find((node) => node.id === nodeId),
  );

export const slotSelector: (
  slotId: string,
) => Selector<RootState, IMappingSlot | undefined> = (slotId) =>
  createSelector([dataSelector], (data) =>
    data.slots.find((slot) => slot.id === slotId),
  );

export const nodeIdsInSlotSelector: (
  slotId: string,
) => Selector<RootState, string[]> = (slotId) =>
  createSelector([mappingSelector, freeNodesSelector], (mapping, freeNodes) =>
    slotId === FREE_SLOT_ID
      ? freeNodes.map((freeNode) => freeNode.id)
      : mapping.map[slotId] ?? [],
  );

export const nodesInSlotSelector: (
  slotId: string,
) => Selector<RootState, IMappingNode[]> = (slotId) =>
  createSelector(
    [nodeIdsInSlotSelector(slotId), dataSelector],
    (nodeIdsInSlot, data) => {
      return nodeIdsInSlot.map(
        (nodeId) => data.nodes.find((node) => node.id === nodeId)!,
      );
    },
  );
