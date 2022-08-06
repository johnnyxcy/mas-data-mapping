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
import type { IMappingObject, IMappingSlotData } from '@data-mapping/_types';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IMasDataMappingMap {
  mappingObject: IMappingObject;
}

export interface ISetToSlotPayload {
  nodeIdOrIds: string | string[];
  slot: IMappingSlotData;
}

export interface IRemoveNodeFromSlotPayload {
  nodeId: string;
  slotId: string; // if slotId is not given, it will be popped from any slot
}

export interface IRemoveFromAnySlotPayload {
  nodeIdOrIds: string | string[];
}

export interface IClearNodesInSlotPayload {
  slotId: string;
}

const initialState: IMasDataMappingMap = {
  mappingObject: {},
};

const popNodeFromAnySlot = (
  state: WritableDraft<IMasDataMappingMap>,
  nodeId: string,
) => {
  for (const [slotId, nodeIds] of Object.entries(state.mappingObject)) {
    const foundIndex = nodeIds.indexOf(nodeId);
    if (foundIndex !== -1) {
      state.mappingObject[slotId].splice(foundIndex, 1);
    }
  }
};

export const {
  actions: mapActions,
  reducer: mapReducer,
  name: mapActionPrefix,
} = createSlice({
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
      const { mappingObject: mapping } = action.payload;
      state.mappingObject = mapping;
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
      const appendingNodeIds =
        typeof nodeIdOrIds === 'string' ? [nodeIdOrIds] : [...nodeIdOrIds];

      if (!slot.allowMultiple && appendingNodeIds.length > 1) {
        // WARNING: don't put multiple nodes into a slot that is not marked as 'allowMultiple'
        return;
      }

      for (const nodeId of appendingNodeIds) {
        popNodeFromAnySlot(state, nodeId);
      }

      state.mappingObject[slot.id] = slot.allowMultiple
        ? (state.mappingObject[slot.id] ?? []).concat(appendingNodeIds) // if allowMultiple, concat
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
      if (state.mappingObject[slotId] !== undefined) {
        state.mappingObject[slotId] = state.mappingObject[slotId].filter(
          (nodeIdInSlot) => nodeIdInSlot !== nodeId,
        );
      }
    },

    /**
     * Remove node from any slot
     * @param state current state
     * @param action nodeId
     * @deprecated after version 2.0.0
     */
    removeFromAnySlot: (
      state: WritableDraft<IMasDataMappingMap>,
      action: PayloadAction<IRemoveFromAnySlotPayload>,
    ) => {
      const { nodeIdOrIds } = action.payload;
      const removingNodeIds =
        typeof nodeIdOrIds === 'string' ? [nodeIdOrIds] : [...nodeIdOrIds];

      removingNodeIds.forEach((nodeId) => popNodeFromAnySlot(state, nodeId));
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
      state.mappingObject[slotId] = [];
    },
  },
});
