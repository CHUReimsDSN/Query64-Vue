---
title: Interopérabilité
layout: default
nav_order: 80
---
# Interopérabilité

Query64 repose sur la communication entre un client et un serveur.
Dans cette version Vue, on suppose que le client communique via des appels HTTP,
et que ces appels sont envoyés dans des fonctions asynchrones.

Query64 doit définir deux appels pour communiquer avec le serveur : 
- Récupération des metadata de la grille
- Récupération des lignes

```ts
export async function getMetadataQuery64(query64MetadataParams: TQuery64GetMetadataParams) {
  return (
    await api.post('my-api/get-metadata-query64', {
      query64Params: query64MetadataParams,
    })
  ).data;
}
export async function getRowsQuery64(
  query64RowParams: TQuery64GetRowsParams,
): Promise<TAggridGenericData> {
  return (
    await api.post('my-api/get-rows-query64', {
      query64Params: query64RowParams,
    })
  ).data;
}
```

{: .important }
Les appels doivent utiliser les méthodes POST / PUT / PATCH pour pouvoir envoyer les données au serveur.