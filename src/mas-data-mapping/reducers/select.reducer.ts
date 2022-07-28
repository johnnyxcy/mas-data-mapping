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
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IMappingNodeData } from '@data-mapping/_types';

export type ISelectionModeType = 'single' | 'onShift' | 'onCtrlCmd';

export interface IMasDataMappingSelection {
  selectedNodes: IMappingNodeData[];
  selectionMode: ISelectionModeType;
}

export interface IToggleNodeSelection {
  node: IMappingNodeData;
  nodesInSameSlot: IMappingNodeData[];
}

export interface IChangeModePayload {
  mode: ISelectionModeType;
}

const initialState: IMasDataMappingSelection = {
  selectedNodes: [],
  selectionMode: 'single',
};

export const {
  actions: selectionActions,
  reducer: selectionReducer,
  name: selectionActionPrefix,
} = createSlice({
  name: 'mas-data-mapping-selection',
  initialState,
  reducers: {
    /**
     * Select a single node with current mode
     *
     * @param state current state
     * @param action nodeId to add
     */
    toggleNodeSelection: (
      state: WritableDraft<IMasDataMappingSelection>,
      action: PayloadAction<IToggleNodeSelection>,
    ) => {
      const { node, nodesInSameSlot } = action.payload;
      switch (state.selectionMode) {
        case 'single': {
          if (
            state.selectedNodes.length === 1 &&
            state.selectedNodes[0].id === node.id
          ) {
            state.selectedNodes = [];
          } else {
            state.selectedNodes = [node];
          }
          break;
        }
        case 'onCtrlCmd': {
          const foundIndex = state.selectedNodes.findIndex(
            (selectedNode) => selectedNode.id === node.id,
          );
          if (foundIndex !== -1) {
            state.selectedNodes.splice(foundIndex, 1);
          } else {
            state.selectedNodes.push(node);
          }
          break;
        }
        case 'onShift': {
          if (state.selectedNodes.length === 0) {
            state.selectedNodes = [node];
          } else {
            const from = state.selectedNodes[state.selectedNodes.length - 1];
            const to = node;
            let leftIndex = nodesInSameSlot.findIndex(
              (nodeInSlot) => nodeInSlot.id === from.id,
            );
            let rightIndex = nodesInSameSlot.findIndex(
              (nodeInSlot) => nodeInSlot.id === to.id,
            );
            if (leftIndex > rightIndex) {
              const temp = leftIndex;
              leftIndex = rightIndex;
              rightIndex = temp;
            }

            state.selectedNodes = nodesInSameSlot.slice(
              leftIndex,
              rightIndex + 1,
            );
          }
          break;
        }
        default:
          break;
      }
    },
    /**
     * Clear all selected nodes
     *
     * @param state current state
     */
    clearSelection: (state: WritableDraft<IMasDataMappingSelection>) => {
      state.selectedNodes = [];
    },

    /**
     * Change the mode of selection
     *
     * @param state
     * @param action
     */
    changeMode: (
      state: WritableDraft<IMasDataMappingSelection>,
      action: PayloadAction<IChangeModePayload>,
    ) => {
      const { mode } = action.payload;
      state.selectionMode = mode;
    },
  },
});
