---
title: 'MaSDataMapping'
---

<div align="center"><img src="https://raw.githubusercontent.com/Johnnyxcy/mas-data-mapping/main/public/assets/icon.png" alt="mas-icon" height="100px" width="100px" /></div>
<div align="center"><h1>MaS Data Mapping</h1></div>

<div align="center"><h4><u>A React component for performing "map" actions</u></h4></div>

**_Visit this [github page](https://johnnyxcy.github.io/mas-data-mapping)_** 🤓

## ⭐ Feature

- 😸 Perform "map" action in multiple ways
- 👍 Well-implemented **drag and drop** functionality
- 🌈 Customizable styles

## 📦 Installation

```bash
$ git clone git@github.com:Johnnyxcy/mas-data-mapping.git
$ npm install
```

<Alert type="warning">
 Will be published to npm ASAP 🥹
</Alert>

## Basic Usage

```tsx
/**
 * title: Basic Demo
 * desc: 👉 Try to drag node in **Available** slot into any slot below<br />👉 Try to click slot to trigger dropdown selection<br />👉 Try to input any value in slot<br />👉 Try to use `ctrl` / `cmd` key to select multiple nodes and drag<br />👉 Try to use `shift` key to select multiple nodes in the same slot and drag
 */

import React from 'react';
import DataMapping from 'mas-data-mapping';
import { Alert, Divider, Space } from 'antd';

const demoData = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const nodes = demoData.map((colName) => ({ id: colName, label: colName }));

const slots = [
  {
    id: 'SingleRequired',
    label: 'SingleRequired',
    required: true,
    allowMultiple: false,
    visible: true,
  },
  {
    id: 'MultipleRequired',
    label: 'MultipleRequired',
    required: true,
    allowMultiple: true,
    visible: true,
  },
  {
    id: 'SingleOptional',
    label: 'SingleOptional',
    required: false,
    allowMultiple: false,
    visible: true,
  },
  {
    id: 'MultipleOptional',
    label: 'MultipleOptional',
    required: false,
    allowMultiple: true,
    visible: true,
  },
  {
    id: 'hiddenSlot',
    label: 'hiddenSlot',
    visible: false,
  },
];

type MappingType = Record<string, string[]>;
const initialMapping: MappingType = {};
initialMapping['SingleOptional'] = ['E'];

export default () => {
  const [mappingHistoryList, setMappingHistoryList] = React.useState<
    MappingType[]
  >([]);

  const onMappingChange = React.useCallback(
    (mapping: MappingType) =>
      setMappingHistoryList(mappingHistoryList.concat(mapping)),
    [mappingHistoryList],
  );

  const mappingHistoryAlerts = React.useMemo(
    () =>
      mappingHistoryList.map((mappingHistory, index) => (
        <Alert
          key={`mapping-history-${index}`}
          message={`Mapping Updated: ${JSON.stringify(mappingHistory)}`}
          type="info"
          showIcon
          closable
        />
      )),
    [mappingHistoryList],
  );

  return (
    <>
      <DataMapping
        nodes={nodes}
        slots={slots}
        initialMapping={initialMapping}
        onMappingChange={onMappingChange}
      />
      <Divider orientation="left" plain>
        Action History
      </Divider>
      <Space direction="vertical" style={{ width: '-webkit-fill-available' }}>
        {mappingHistoryAlerts}
      </Space>
    </>
  );
};
```

## Development

### Clone and install the dependencies

```bash
$ git clone git@github.com:Johnnyxcy/mas-data-mapping.git
$ npm install
```

### Start dev server via scaffolding [umijs/dumi](https://github.com/umijs/dumi)

```bash
npm start
```

### License

`mas-data-mapping` is licensed under [MIT](https://opensource.org/licenses/MIT)
