/*
 * MIT License
 *
 * Copyright (c) 2022 ${company}
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

import React from 'react';

import { Col, Row } from 'antd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Provider, useDispatch, useSelector } from 'react-redux';

import CustomLayer from '@data-mapping/layer/CustomLayer';
import { FreeSlot } from '@data-mapping/droppable/FreeSlot';
import { MapSlot } from '@data-mapping/droppable/MapSlot';
import { createRootStore } from '@data-mapping/store/root.store';
import { dataActions } from '@data-mapping/reducers/data.reducer';
import { dataSelector } from '@data-mapping/store/selector';
import { mapActions } from '@data-mapping/reducers/mapping.reducer';
import { selectionActions } from '@data-mapping/reducers/select.reducer';

import type {
  IMappingNode,
  IMappingObject,
  IMappingSlotBase,
  IMappingSlotExtend,
} from './types';

import '@data-mapping/DataMapping.css';

interface IMappingNodeProps extends IMappingNode {}
interface IMappingSlotProps
  extends IMappingSlotBase,
    Partial<IMappingSlotExtend> {}

const isMac = /mac/i.test(navigator.platform);

const isCtrlCmd = (e: KeyboardEvent) =>
  (isMac && e.metaKey) || (!isMac && e.ctrlKey);

export interface IDataMappingProps {
  /**
   * @description A unique id to identify the mapping component
   */
  id: string;

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
   * @default {}
   */
  mapping?: IMappingObject;

  /**
   * @description Description for free slot
   * @default "Available"
   */
  freeSlotDescription?: React.ReactNode | (() => React.ReactNode);

  /**
   * @description callback on map object changed
   * @default undefined
   */
  onMappingChange?: (mapping: IMappingObject) => void;
}

/** 加入这个只是为了导出子类型, see https://github.com/umijs/dumi/issues/914 */
// eslint-disable-next-line @typescript-eslint/no-redeclare, @typescript-eslint/no-unused-vars
export const IMappingNodeProps = (props: IMappingNode) => {};

// eslint-disable-next-line @typescript-eslint/no-redeclare, @typescript-eslint/no-unused-vars
export const IMappingSlotProps = (props: IMappingSlotProps) => {};

const DataMappingWrap: React.FC<Omit<IDataMappingProps, 'onMappingChange'>> = (
  props,
) => {
  const { id: instanceId, nodes, slots, mapping, freeSlotDescription } = props;
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(
      dataActions.setData({
        nodes,
        slots: slots.map((slot) => ({
          id: slot.id,
          label: slot.label,
          /** Fill in all optional arguments */
          required: slot.required ?? false,
          visible: slot.visible ?? true,
          allowMultiple: slot.allowMultiple ?? true,
        })),
      }),
    );
    if (mapping !== undefined) {
      dispatch(mapActions.setMapping({ map: mapping }));
    }
  }, [dispatch, nodes, slots, mapping]);

  React.useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (isCtrlCmd(e)) {
        dispatch(selectionActions.changeMode({ mode: 'onCtrlCmd' }));
      } else if (e.shiftKey) {
        dispatch(selectionActions.changeMode({ mode: 'onShift' }));
      }
    };
    const onKeyUp = () => {
      dispatch(selectionActions.changeMode({ mode: 'single' }));
    };

    window.addEventListener('keydown', onKeydown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [dispatch]);

  /**
   * Handle any click outside div to cancel current selection
   */
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onClickOutside = React.useCallback(
    (e: MouseEvent) => {
      const { target } = e;
      if (
        containerRef.current &&
        target instanceof Node &&
        !containerRef.current.contains(target)
      ) {
        dispatch(selectionActions.clearSelection());
      }
    },
    [dispatch, containerRef],
  );

  React.useEffect(() => {
    window.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('mousedown', onClickOutside);
    };
  }, [onClickOutside]);

  let freeSlotTitleNode: React.ReactNode = 'Available';
  if (freeSlotDescription !== undefined) {
    freeSlotTitleNode =
      typeof freeSlotDescription === 'function'
        ? freeSlotDescription()
        : freeSlotDescription;
  }

  const { slots: curSlots } = useSelector(dataSelector);
  return (
    <div className="mas-data-mapping-container" ref={containerRef}>
      <Row>
        <Col span={24} style={{ padding: '0px 4px 0px 4px' }}>
          <FreeSlot
            instanceId={instanceId}
            description={freeSlotTitleNode}
            bodyStyle={{ padding: 8, minHeight: 40 }}
          />
        </Col>
      </Row>
      <Row style={{ height: 16 }} />
      <Row justify="start">
        {curSlots
          .filter((slot) => slot.visible === true)
          .map((slot) => (
            <Col key={slot.id} span={8} style={{ padding: '0px 4px 4px 4px' }}>
              <MapSlot instanceId={instanceId} id={slot.id} />
            </Col>
          ))}
      </Row>
    </div>
  );
};

export const DataMapping: React.FC<IDataMappingProps> = (props) => {
  const rootStore = createRootStore();
  const mappingRef = React.useRef(rootStore.getState().mapping);
  const { onMappingChange, ...otherProps } = props;
  React.useEffect(() => {
    if (onMappingChange) {
      const unsubscribe = rootStore.subscribe(() => {
        const { mapping } = rootStore.getState();
        if (mapping !== mappingRef.current) {
          onMappingChange(mapping.map);
          mappingRef.current = mapping;
        }
      });
      return () => unsubscribe();
    }
    return () => {};
  }, [rootStore, onMappingChange]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Provider store={rootStore}>
        <CustomLayer />
        <DataMappingWrap {...otherProps} />
      </Provider>
    </DndProvider>
  );
};

export default DataMapping;
