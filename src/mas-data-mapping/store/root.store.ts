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
import { configureStore } from '@reduxjs/toolkit';

import { selectionReducer } from '@data-mapping/reducers/select.reducer';

import { mapReducer } from '@data-mapping/reducers/mapping.reducer';

import { dataReducer } from '@data-mapping/reducers/data.reducer';

import type { IMasDataMappingSelection } from '@data-mapping/reducers/select.reducer';
import type { IMasDataMappingMap } from '@data-mapping/reducers/mapping.reducer';
import type { IMasDataMappingData } from '@data-mapping/reducers/data.reducer';

export function createRootStore() {
  return configureStore({
    reducer: {
      data: dataReducer,
      mapping: mapReducer,
      selection: selectionReducer,
    },
  });
}

export type RootState = {
  data: IMasDataMappingData;
  mapping: IMasDataMappingMap;
  selection: IMasDataMappingSelection;
};
