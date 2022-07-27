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
import { createSlice } from '@reduxjs/toolkit';

import type { WritableDraft } from 'immer/dist/types/types-external';
import type { IMappingObject, IMappingSlot } from '@data-mapping/types';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IMasDataMappingMap {
  map: IMappingObject;
}

export interface ISetToSlotPayload {
  nodeIdOrIds: string | string[];
  slot: IMappingSlot;
}

export interface IRemoveNodeFromSlotPayload {
  nodeId: string;
  slotId: string;
}

export interface IClearNodesInSlotPayload {
  slotId: string;
}

const initialState: IMasDataMappingMap = {
  map: {},
};

export const { actions: mapActions, reducer: mapReducer } = createSlice({
  name: 'mas-data-mapping-map',
  initialState,
  reducers: {
    /**
     * Set mapping directly, you might only want to use this reducer to set initial state
     * @param state current state
     * @param action map object
     * @note This is dangerous
     */
    setMapping: (
      state: WritableDraft<IMasDataMappingMap>,
      action: PayloadAction<IMasDataMappingMap>,
    ) => {
      const { map: mapping } = action.payload;
      state.map = mapping;
    },
    /**
     * Set node or nodes into a given slot
     *
     * @param state current state
     * @param action nodeId or nodeIds and the slotId
     */
    setToSlot: (
      state: WritableDraft<IMasDataMappingMap>,
      action: PayloadAction<ISetToSlotPayload>,
    ) => {
      const { nodeIdOrIds, slot } = action.payload;

      const popNodeFromAnySlot = (nodeId: string) => {
        for (const [slotId, nodeIds] of Object.entries(state.map)) {
          const foundIndex = nodeIds.indexOf(nodeId);
          if (foundIndex !== -1) {
            state.map[slotId].splice(foundIndex, 1);
          }
        }
      };

      const appendingNodeIds =
        typeof nodeIdOrIds === 'string' ? [nodeIdOrIds] : [...nodeIdOrIds];

      if (!slot.allowMultiple && appendingNodeIds.length > 1) {
        // WARNING: don't put multiple nodes into a slot that is not marked as 'allowMultiple'
        return;
      }

      for (const nodeId of appendingNodeIds) {
        popNodeFromAnySlot(nodeId);
      }

      state.map[slot.id] = slot.allowMultiple
        ? (state.map[slot.id] ?? []).concat(appendingNodeIds) // if allowMultiple, concat
        : appendingNodeIds; // else replace
    },

    /**
     * Remove a single node from a given slot
     *
     * @param state current state
     * @param action nodeId and slotId
     */
    removeNodeFromSlot: (
      state: WritableDraft<IMasDataMappingMap>,
      action: PayloadAction<IRemoveNodeFromSlotPayload>,
    ) => {
      const { nodeId, slotId } = action.payload;
      if (state.map[slotId] !== undefined) {
        state.map[slotId] = state.map[slotId].filter(
          (nodeIdInSlot) => nodeIdInSlot !== nodeId,
        );
      }
      // else do nothing because there is nothing in slot yet
    },

    /**
     * Clear All nodes in the given slot
     * @param state current state
     * @param action slotId
     */
    clearNodesInSlot: (
      state: WritableDraft<IMasDataMappingMap>,
      action: PayloadAction<IClearNodesInSlotPayload>,
    ) => {
      const { slotId } = action.payload;
      state.map[slotId] = [];
    },
  },
});
