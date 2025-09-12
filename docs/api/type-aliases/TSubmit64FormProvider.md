---
layout: default
title: TSubmit64FormProvider
nav_order: 1
parent: API
---

[**submit64-vue v1.0.1**](../README.md)

***

# Type Alias: TSubmit64FormProvider

> **TSubmit64FormProvider** = `object`

Defined in: [models.ts:162](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L162)

## Properties

### getDefaultDataByFieldName()

> **getDefaultDataByFieldName**: (`fieldName`) => `void` \| `unknown`

Defined in: [models.ts:164](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L164)

#### Parameters

##### fieldName

`string`

#### Returns

`void` \| `unknown`

***

### getFieldDataByFieldName()

> **getFieldDataByFieldName**: (`fieldName`) => `unknown`

Defined in: [models.ts:165](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L165)

#### Parameters

##### fieldName

`string`

#### Returns

`unknown`

***

### getForm()

> **getForm**: () => [`TFormDef`](TFormDef.md)

Defined in: [models.ts:167](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L167)

#### Returns

[`TFormDef`](TFormDef.md)

***

### getFormFactoryInstance()

> **getFormFactoryInstance**: () => `Readonly`\<`FormFactory`\>

Defined in: [models.ts:166](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L166)

#### Returns

`Readonly`\<`FormFactory`\>

***

### registerRef()

> **registerRef**: (`resourceDataKey`, `fieldRef`) => `void`

Defined in: [models.ts:163](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L163)

#### Parameters

##### resourceDataKey

`string`

##### fieldRef

[`TSubmit64Field`](TSubmit64Field.md)

#### Returns

`void`

## Methods

### getAssociationDataCallback()

> **getAssociationDataCallback**(): (`submit64Params`) => `Promise`\<[`TSubmit64AssociationData`](TSubmit64AssociationData.md)\>

Defined in: [models.ts:168](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L168)

#### Returns

> (`submit64Params`): `Promise`\<[`TSubmit64AssociationData`](TSubmit64AssociationData.md)\>

##### Parameters

###### submit64Params

[`TSubmit64GetAssociationData`](TSubmit64GetAssociationData.md)

##### Returns

`Promise`\<[`TSubmit64AssociationData`](TSubmit64AssociationData.md)\>
