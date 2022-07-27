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

import type { WritableDraft } from 'immer/dist/types/types-external';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { IMappingNode, IMappingSlot } from '@data-mapping/types';

export interface IMasDataMappingData {
  nodes: IMappingNode[];
  slots: IMappingSlot[];
}

export interface IChangeSlotVisiblePayload {
  slotId: string;
  visible: boolean;
}

const initialState: IMasDataMappingData = {
  nodes: [],
  slots: [],
};

export const { actions: dataActions, reducer: dataReducer } = createSlice({
  name: 'mas-data-mapping-data',
  initialState,
  reducers: {
    /**
     * Set whole data
     *
     * @param state current state
     * @param action data to set
     */
    setData: (
      state: WritableDraft<IMasDataMappingData>,
      action: PayloadAction<IMasDataMappingData>,
    ) => {
      const { nodes, slots } = action.payload;
      state.nodes = nodes;
      state.slots = slots;
    },

    /**
     * Clear all data
     * @param state current state
     */
    clearData: (state: WritableDraft<IMasDataMappingData>) => {
      state.nodes = [];
      state.slots = [];
    },

    /**
     * Change the visibility of the slot
     * @param state current state
     * @param action slotId and visibility
     */
    changeSlotVisible: (
      state: WritableDraft<IMasDataMappingData>,
      action: PayloadAction<IChangeSlotVisiblePayload>,
    ) => {
      const { slotId, visible } = action.payload;

      const slotToChange = state.slots.find((slot) => slot.id === slotId);
      if (slotToChange !== undefined) {
        slotToChange.visible = visible;
      }
    },
  },
});
