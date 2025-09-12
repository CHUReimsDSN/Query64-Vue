---
layout: default
title: TSubmit64FormProps
nav_order: 1
parent: API
---

[**submit64-vue v1.0.1**](../README.md)

***

# Type Alias: TSubmit64FormProps

> **TSubmit64FormProps** = `object`

Defined in: [models.ts:174](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L174)

## Properties

### context?

> `optional` **context**: [`TContext`](TContext.md)

Defined in: [models.ts:187](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L187)

***

### formSettings?

> `optional` **formSettings**: [`TFormSettings`](TFormSettings.md)

Defined in: [models.ts:184](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L184)

***

### getAssociationData()?

> `optional` **getAssociationData**: (`submit64Params`) => `Promise`\<[`TSubmit64AssociationData`](TSubmit64AssociationData.md)\>

Defined in: [models.ts:180](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L180)

#### Parameters

##### submit64Params

[`TSubmit64GetAssociationData`](TSubmit64GetAssociationData.md)

#### Returns

`Promise`\<[`TSubmit64AssociationData`](TSubmit64AssociationData.md)\>

***

### getMetadataAndData()

> **getMetadataAndData**: (`submit64Params`) => `Promise`\<[`TResourceFormMetadataAndData`](TResourceFormMetadataAndData.md)\>

Defined in: [models.ts:176](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L176)

#### Parameters

##### submit64Params

[`TSubmit64GetMetadataAndData`](TSubmit64GetMetadataAndData.md)

#### Returns

`Promise`\<[`TResourceFormMetadataAndData`](TResourceFormMetadataAndData.md)\>

***

### getSubmitFormData()

> **getSubmitFormData**: (`submit64Params`) => `Promise`\<[`TSubmit64SubmitSubmitData`](TSubmit64SubmitSubmitData.md)\>

Defined in: [models.ts:179](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L179)

#### Parameters

##### submit64Params

[`TSubmit64GetSubmitData`](TSubmit64GetSubmitData.md)

#### Returns

`Promise`\<[`TSubmit64SubmitSubmitData`](TSubmit64SubmitSubmitData.md)\>

***

### onSubmitFail()?

> `optional` **onSubmitFail**: () => `void`

Defined in: [models.ts:185](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L185)

#### Returns

`void`

***

### onSubmitSuccess()?

> `optional` **onSubmitSuccess**: () => `void`

Defined in: [models.ts:186](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L186)

#### Returns

`void`

***

### resourceId?

> `optional` **resourceId**: `TRecord`\[`"id"`\]

Defined in: [models.ts:183](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L183)

***

### resourceName

> **resourceName**: `string`

Defined in: [models.ts:175](https://github.com/CHUReimsDSN/Submit64-Vue/blob/b0ac49071bd835942dbc5de42858809d4b23b034/src/models.ts#L175)
