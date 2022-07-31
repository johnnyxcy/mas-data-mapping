/*
 * MIT License
 *
 * Copyright (c) 2022 Chongyi XU
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
import { Menu } from 'antd';

import type {
  ISlotMaskRenderer,
  ISlotSelectDropdownRenderer,
  ISlotStyler,
  ITagNodeStyler,
} from '@data-mapping/_types';

export const DefaultSlotMaskRender: ISlotMaskRenderer = ({
  slot,
  isDragging,
  canDrop,
  isOver,
}) => (
  <div
    style={{
      display: isDragging ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',

      /** Fit content */
      height: '100%',
      width: '100%',

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

export const DefaultSlotStyler: ISlotStyler = ({ slot, canDrop }) => ({
  /**
   * background-color
   */
  backgroundColor: canDrop
    ? 'var(--ant-success-color-deprecated-bg)'
    : undefined,

  opacity: slot !== 'free-slot' && !slot.visible ? 0.4 : undefined,
});

export const DefaultSlotSelectDropdown: ISlotSelectDropdownRenderer = ({
  currentSlot,
  otherSlots,
  freeNodes,
  onSelect = undefined,
  onDeselect = undefined,
}) => (
  <Menu
    defaultOpenKeys={['selected', 'not-selected']}
    mode='inline'
    selectedKeys={currentSlot.nodesInSlot.map((nodeData) => nodeData.id)}
    selectable
    style={{ userSelect: 'none' }}
    onSelect={onSelect}
    onDeselect={onDeselect}
  >
    <Menu.SubMenu title='SELECTED' key='selected'>
      {currentSlot.nodesInSlot.map((nodeData) => (
        <Menu.Item key={nodeData.id}>{nodeData.label}</Menu.Item>
      ))}
    </Menu.SubMenu>
    <Menu.SubMenu title='NOT-SELECTED' key='not-selected'>
      {freeNodes.map((nodeData) => (
        <Menu.Item key={nodeData.id}>{nodeData.label}</Menu.Item>
      ))}
    </Menu.SubMenu>
    <Menu.SubMenu title='REPLACE' key='replace'>
      {otherSlots
        .filter((info) => info.nodesInSlot.length > 0)
        .map((info) => (
          <Menu.ItemGroup title={info.slot.label} key={info.slot.id}>
            {info.nodesInSlot.map((nodeData) => (
              <Menu.Item key={nodeData.id} disabled={!info.slot.visible}>
                {nodeData.label}
              </Menu.Item>
            ))}
          </Menu.ItemGroup>
        ))}
    </Menu.SubMenu>
  </Menu>
);
