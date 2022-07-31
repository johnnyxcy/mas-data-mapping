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

import React from 'react';

import { Col, Row } from 'antd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Provider, useDispatch, useSelector } from 'react-redux';

import InstanceContext from '@data-mapping/_internal/context';
import { isCtrlCmd } from '@data-mapping/_internal/keyboardUtil';
import CustomLayer from '@data-mapping/layer/CustomLayer';
import { FreeSlot } from '@data-mapping/droppable/FreeSlot';
import { MapSlot } from '@data-mapping/droppable/MapSlot';
import { DraggableNode } from '@data-mapping/draggable/DraggableNode';
import {
  freeNodesSelector,
  mappingSelector,
  selectionSelector,
} from '@data-mapping/store/selector';
import { createRootStore } from '@data-mapping/store/root.store';
import {
  mapActionPrefix,
  mapActions,
} from '@data-mapping/reducers/mapping.reducer';
import { dataActions } from '@data-mapping/reducers/data.reducer';
import { selectionActions } from '@data-mapping/reducers/select.reducer';
import {
  DefaultSlotMaskRender,
  DefaultSlotSelectDropdown,
  DefaultSlotStyler,
  DefaultTagNodeStyler,
} from '@data-mapping/DefaultRender';

import type { IDraggingItem } from '@data-mapping/_internal/dnd';
import type * as types from './_types';

import '@data-mapping/DataMapping.css';

const DataMappingComponent: React.FC<
  Omit<types.IDataMappingProps, 'onMappingChange'>
> = ({
  nodes,
  slots,
  selectDropdownRenderer = DefaultSlotSelectDropdown,
  slotMaskRenderer = DefaultSlotMaskRender,
  tagNodeStyler = DefaultTagNodeStyler,
  freeSlotLabel = 'Available',
  initialMapping = undefined,
  // TODO: implement visibility
  showHidden = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onVisibleChange = undefined,
}) => {
  /**
   * redux-hooks
   */
  const dispatch = useDispatch();
  const { selectedNodes } = useSelector(selectionSelector);
  const freeNodes = useSelector(freeNodesSelector);
  const { mappingObject } = useSelector(mappingSelector);

  const nodesData: types.IMappingNodeData[] = React.useMemo(
    () => nodes,
    [nodes],
  );

  const slotsData: types.IMappingSlotData[] = React.useMemo(
    () =>
      slots.map((slot) => ({
        ...slot,
        allowMultiple: slot.allowMultiple ?? true,
        required: slot.required ?? false,
        visible: slot.visible ?? true,
      })),
    [slots],
  );

  React.useEffect(() => {
    dispatch(dataActions.setData({ nodes: nodesData, slots: slotsData }));
  }, [dispatch, nodesData, slotsData]);

  React.useEffect(() => {
    if (initialMapping) {
      dispatch(mapActions.setMapping({ mappingObject: initialMapping }));
    }
  }, [dispatch, initialMapping]);

  // #region Handle any click outside div to cancel current selection
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onClickOutside = React.useCallback(
    (e: MouseEvent) => {
      const { target } = e;
      if (
        containerRef.current &&
        target instanceof Node &&
        !containerRef.current.contains(target) &&
        selectedNodes.length !== 0
      ) {
        dispatch(selectionActions.clearSelection());
      }
    },
    [dispatch, selectedNodes.length],
  );

  React.useEffect(() => {
    window.addEventListener('mouseup', onClickOutside);
    return () => {
      window.removeEventListener('mouseup', onClickOutside);
    };
  }, [onClickOutside]);

  // #endregion

  // #region Listen to the keyboard event to control selection mode
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

  // #endregion

  // #region callbacks

  /**
   * Find node in given slotId
   */
  const findNodesInSlot = React.useCallback(
    (slotId: string) =>
      mappingObject[slotId]?.map(
        (nodeId) => nodesData.find((nodeData) => nodeData.id === nodeId)!,
      ) ?? [],
    [mappingObject, nodesData],
  );

  // const findNodesInOtherSlot = React.useCallback(
  //   (slotId: string) => {
  //     const nodesInOtherSlot: {
  //       slotId: string;
  //       label: React.ReactNode;
  //       nodes: types.IMappingNodeData[];
  //     }[] = [];
  //     for (const [mappedSlotId, mappedNodeIds] of Object.entries(
  //       mappingObject,
  //     )) {
  //       if (mappedSlotId !== slotId) {
  //         nodesInOtherSlot.push({
  //           slotId: mappedSlotId,
  //           label: slotsData.find((slotData) => slotData.id === mappedSlotId)!
  //             .label,
  //           nodes: mappedNodeIds.map(
  //             (nodeId) => nodesData.find((nodeData) => nodeData.id === nodeId)!,
  //           ),
  //         });
  //       }
  //     }
  //     return nodesInOtherSlot;
  //   },
  //   [mappingObject, nodesData, slotsData],
  // );

  const findNodesInOtherSlot = React.useCallback(
    (slotId: string) => {
      const res: types.ISelectionOptionData[] = [];

      for (const [mappedSlotId, mappedNodeIds] of Object.entries(
        mappingObject,
      )) {
        if (mappedSlotId !== slotId) {
          res.push({
            slot: slotsData.find((v) => v.id === mappedSlotId)!,
            nodesInSlot: mappedNodeIds.map(
              (nodeId) => nodesData.find((v) => v.id === nodeId)!,
            ),
          });
        }
      }

      return res;
    },
    [mappingObject, nodesData, slotsData],
  );

  /**
   * If the item can be dropped to slot
   */
  const canDropToSlot = React.useCallback(
    (_item: IDraggingItem, slot: types.IMappingSlotData) => {
      if (!slot.visible) {
        return false;
      }
      // TODO: add exclusion pattern feature
      const { allowMultiple } = slot;
      if (!allowMultiple) {
        return selectedNodes.length <= 1;
      }
      return true;
    },
    [selectedNodes],
  );

  const onDropToSlot = React.useCallback(
    (item: IDraggingItem, slot: types.IMappingSlotData | 'free-slot') => {
      const nodeIdOrIds =
        selectedNodes.length === 0
          ? item.nodeId
          : selectedNodes.map((node) => node.id);
      if (slot === 'free-slot') {
        dispatch(mapActions.removeFromAnySlot({ nodeIdOrIds }));
      } else {
        dispatch(
          mapActions.setToSlot({
            nodeIdOrIds,
            slot,
          }),
        );
      }

      dispatch(selectionActions.clearSelection());
    },
    [dispatch, selectedNodes],
  );

  const onRemoveNodeFromSlot = React.useCallback(
    (nodeId: string, slotId: string) => {
      dispatch(mapActions.removeNodeFromSlot({ nodeId, slotId }));
      dispatch(selectionActions.clearSelection());
    },
    [dispatch],
  );

  const onSelectNodeInSlot = React.useCallback(
    (node: types.IMappingNodeData, slotId?: string) => {
      const nodesInSameSlot =
        slotId !== undefined ? findNodesInSlot(slotId) : freeNodes;
      dispatch(
        selectionActions.toggleNodeSelection({
          node,
          nodesInSameSlot,
        }),
      );
    },
    [dispatch, findNodesInSlot, freeNodes],
  );

  const onClearSlot = React.useCallback(
    (slotId: string) => {
      dispatch(mapActions.clearNodesInSlot({ slotId }));
    },
    [dispatch],
  );

  const onAddNodeInSlot = React.useCallback(
    (nodeId: string, slot: types.IMappingSlotData) => {
      dispatch(mapActions.setToSlot({ nodeIdOrIds: nodeId, slot }));
    },
    [dispatch],
  );

  // #endregion

  // #region render

  const renderTag = React.useCallback(
    (options: {
      node: types.IMappingNodeData;
      canSelect: boolean;
      canDrag: boolean;
      canClose: boolean;
      parentSlotId?: string;
    }) => {
      const { node, parentSlotId, canSelect, canDrag, canClose } = options;

      const isSelected = canSelect
        ? selectedNodes.findIndex(
            (selectedNode) => selectedNode.id === node.id,
          ) !== -1
        : false;

      return (
        <DraggableNode
          key={node.id}
          node={node}
          selected={isSelected}
          tagStyler={tagNodeStyler}
          draggable={
            canDrag
              ? {
                  canDrag: isSelected || selectedNodes.length === 0,
                  isDragging: (item) =>
                    isSelected ||
                    (selectedNodes.length === 0 && item.nodeId === node.id),
                  endDrag: () => {},
                }
              : undefined
          }
          closable={
            canClose && parentSlotId !== undefined
              ? {
                  onClose: () => onRemoveNodeFromSlot(node.id, parentSlotId),
                }
              : undefined
          }
          onClick={
            canSelect ? () => onSelectNodeInSlot(node, parentSlotId) : undefined
          }
        />
      );
    },
    [onRemoveNodeFromSlot, onSelectNodeInSlot, selectedNodes, tagNodeStyler],
  );

  const renderSlot: types.ISlotSelectDropdownRenderer = React.useCallback(
    (props) => {
      const {
        currentSlot: { slot, nodesInSlot },
        otherSlots,
      } = props;
      const { id: slotId } = slot;
      return (
        <Col key={slotId} span={8}>
          <MapSlot
            nodesInSlotData={nodesInSlot}
            slotData={slot}
            maskRender={slotMaskRenderer}
            slotStyler={DefaultSlotStyler}
            tagRender={(tagProps) =>
              renderTag({
                node: { id: tagProps.value, label: tagProps.label },
                parentSlotId: slotId,
                canClose: tagProps.closable,
                canDrag: slot.visible,
                canSelect: slot.visible,
              })
            }
            dropdownMenu={selectDropdownRenderer({
              currentSlot: { slot, nodesInSlot },
              otherSlots,
              freeNodes,
              onSelect: ({ key }) => onAddNodeInSlot(key, slot),
              onDeselect: ({ key }) => onRemoveNodeFromSlot(key, slot.id),
            })}
            onClear={() => onClearSlot(slotId)}
            droppable={{
              canDrop: (item) => canDropToSlot(item, slot),
              onDrop: (item) => onDropToSlot(item, slot),
            }}
          />
        </Col>
      );
    },
    [
      slotMaskRenderer,
      selectDropdownRenderer,
      freeNodes,
      renderTag,
      onAddNodeInSlot,
      onRemoveNodeFromSlot,
      onClearSlot,
      canDropToSlot,
      onDropToSlot,
    ],
  );

  const slotComponents = React.useMemo(
    () =>
      (showHidden
        ? slotsData
        : slotsData.filter((slot) => slot.visible === true)
      ).map((slot) =>
        renderSlot({
          currentSlot: { slot, nodesInSlot: findNodesInSlot(slot.id) },
          otherSlots: findNodesInOtherSlot(slot.id),
          freeNodes,
        }),
      ),
    [
      findNodesInOtherSlot,
      findNodesInSlot,
      freeNodes,
      renderSlot,
      showHidden,
      slotsData,
    ],
  );

  const freeSlot = React.useMemo(
    () => (
      <FreeSlot
        label={freeSlotLabel}
        slotStyler={DefaultSlotStyler}
        bodyStyle={{ padding: 8, minHeight: 40 }}
        childNodes={freeNodes.map((freeNode) =>
          renderTag({
            node: freeNode,
            canDrag: true,
            canClose: false,
            canSelect: true,
          }),
        )}
        maskRender={slotMaskRenderer}
        droppable={{
          onDrop: (item) => onDropToSlot(item, 'free-slot'),
        }}
      />
    ),
    [freeNodes, freeSlotLabel, onDropToSlot, renderTag, slotMaskRenderer],
  );

  const dndLayer = React.useMemo(
    () => (
      <CustomLayer tagStyler={tagNodeStyler} selectedNodes={selectedNodes} />
    ),
    [selectedNodes, tagNodeStyler],
  );

  // #endregion

  return (
    <>
      {dndLayer}
      <div
        className='mas-data-mapping-container'
        ref={containerRef}
        style={{ userSelect: 'none' }}
      >
        <Row>
          <Col span={24}>{freeSlot}</Col>
        </Row>
        <Row style={{ height: 16 }} />
        <Row justify='start' gutter={[8, 8]}>
          {slotComponents}
        </Row>
      </div>
    </>
  );
};

export const DataMapping = (props: types.IDataMappingProps) => {
  /**
   * Create an instance id to differ dnd source
   */
  const instanceId = React.useId();
  const memoedInstanceId = React.useMemo(
    () => ({
      instanceId,
    }),
    [instanceId],
  );

  const storeRef = React.useRef(createRootStore());

  React.useEffect(() => {
    const unsubscribe = storeRef.current.subscribe(() => {
      const { lastAction } = storeRef.current.getState();
      if (
        typeof lastAction.type === 'string' &&
        lastAction.type.startsWith(mapActionPrefix)
      ) {
        const {
          mapping: { mappingObject },
        } = storeRef.current.getState();
        if (props.onMappingChange) {
          props.onMappingChange(mappingObject);
        }
      }
    });
    return unsubscribe;
  }, [props, storeRef]);

  return (
    <DndProvider backend={HTML5Backend}>
      <InstanceContext.Provider value={memoedInstanceId}>
        <Provider store={storeRef.current}>
          <DataMappingComponent {...props} />
        </Provider>
      </InstanceContext.Provider>
    </DndProvider>
  );
};

/** Export these for typescript-doc-gen only, see https://github.com/umijs/dumi/issues/914 */
// eslint-disable-next-line @typescript-eslint/no-redeclare, @typescript-eslint/no-unused-vars
export const IMappingNodeProps = (props: types.IMappingNodeProps) => {};

// eslint-disable-next-line @typescript-eslint/no-redeclare, @typescript-eslint/no-unused-vars
export const IMappingSlotProps = (props: types.IMappingSlotProps) => {};

/** Export default Component */
export default DataMapping;
