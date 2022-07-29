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
import {
  DownloadOutlined,
  ClearOutlined,
  StopOutlined,
  SyncOutlined,
} from '@ant-design/icons';

import type { ISlotMaskRenderer, ITagNodeStyler } from '@data-mapping/_types';

export const DefaultSlotMaskRender: ISlotMaskRenderer = ({
  slot,
  isDragging,
  canDrop,
  isOver,
}) => (
  <div
    style={{
      // display: isDragging ? 'block' : 'none',
      display: isDragging ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',

      /** Fit content */
      height: '100%',
      width: '100%',

      /**
       * background-color
       */
      backgroundColor: canDrop
        ? 'var(--ant-success-color-deprecated-bg)'
        : undefined,
      opacity: '0.6',

      /**
       * border
       */
      boxSizing: 'border-box',
      WebkitBoxSizing: 'border-box',
      MozBoxSizing: 'border-box',
      borderWidth: 4,
      borderStyle: 'dashed',
      borderColor:
        isOver && canDrop
          ? 'var(--ant-success-color-deprecated-border)'
          : 'transparent',
    }}
  >
    {canDrop ? (
      slot === 'free-slot' ? (
        <ClearOutlined style={{ fontSize: 36 }} />
      ) : slot.allowMultiple ? (
        <DownloadOutlined style={{ fontSize: 36 }} />
      ) : (
        <SyncOutlined style={{ fontSize: 36 }} />
      )
    ) : (
      <StopOutlined style={{ fontSize: 36 }} />
    )}
  </div>
);

export const DefaultTagNodeStyler: ITagNodeStyler = ({ selected }) => ({
  backgroundColor: selected ? 'var(--ant-primary-color)' : undefined,
  color: selected ? '#fff' : undefined,
  minWidth: 40,
  textAlign: 'center',
});

export const maskContainerStyle: Readonly<React.CSSProperties> = {
  /** stretch to fit parent */
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '0px',
  left: '0px',

  /** zIndex to perform like a mask */
  zIndex: 8,

  /** click through */
  pointerEvents: 'none',
};
