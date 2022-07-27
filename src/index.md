# mas-data-mapping

## General Usage

mas-data-mapping is a data mapping component

```tsx
import React from 'react';
import DataMapping from 'mas-data-mapping';

const demoData = ['ID', 'TIME', 'DV', '_CONC'];
const nodes = demoData.map((colName) => ({ id: colName, label: colName }));

const slots = [
  {
    id: 'SingleRequired',
    label: 'SingleRequired',
    required: true,
    allowMultiple: false,
  },
  {
    id: 'MultipleRequired',
    label: 'MultipleRequired',
    required: true,
    allowMultiple: true,
  },
  {
    id: 'SingleOptional',
    label: 'SingleOptional',
    required: false,
    allowMultiple: false,
  },
  {
    id: 'MultipleOptional',
    label: 'MultipleOptional',
    required: false,
    allowMultiple: true,
  },
];

export default () => <DataMapping id="demo1" nodes={nodes} slots={slots} />;
```

## Subscription

you can use `onMappingChange` to subscribe mapping changes

```tsx
import React from 'react';
import DataMapping from 'mas-data-mapping';

const demoData = ['ID', 'TIME', 'DV', '_CONC'];
const nodes = demoData.map((colName) => ({ id: colName, label: colName }));

const slots = [
  {
    id: 'SingleRequired',
    label: 'SingleRequired',
    required: true,
    allowMultiple: false,
  },
];

export default () => (
  <DataMapping
    id="demo2"
    nodes={nodes}
    slots={slots}
    onMappingChange={(mapping) => {
      console.log('onMappingChanged', mapping);
    }}
  />
);
```
