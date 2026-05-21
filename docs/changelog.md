---
title: Changelog
---

# Changelog

# 2.0.0

__Features__ : 

- Système de dépendances de colonnes
- Système d'avertissement pour les colonnes customs (les colonnes additionnelles ayant déjà été définies, et les colonnes surchargées n'ayant pas trouver la colonne d'origine)
- Gestionnaire de log pour les avertissements
- Nouveau format de `colId`
- Mise à disposition de l'AgGrid interne pour l'enregistrement des modules à travers la classe `Query64`
- Nouvelles définitions des colonnes additionelles et surchargées
- Définition de paramètre de grille supplémentaire
- Définition de paramètre de composant
- Possibilité d'enregistrer un composant pour l'affichage du nombre de ligne

__Changements__ :

- Changements des props du composant `Query64Grid`. Les props non-réactives sont maintenant groupées dans l'object `initialGridParams`
- Changement des définitions et structures des colonnes additionnelles et surchargées
- Mise à jour d'AgGrid (35.0.0)

__Corrections__ :

- Correction des types de l'api `TQuery64GridApi`
- Correction des accesseurs pour les données d'associations `belongs_to` et `has_one`. Les valeurs sont désormais des objects et non des tuples
- Correction d'un problème d'affichage et de comportement lié au nombre de ligne retourné par la fonction `getRows`
- Correction du cycle de vie des préferences des colonnes

---
### 1.4.7

- Ajout de l'option `pinned` pour les préferences de colonnes

---
### 1.4.6

- Correction d'un problème où l'ordre des colonnes de la props `initialGridParams` était ignoré

---
### 1.4.5

- Ajout d'un paramètre optionnel à `updateGridParams` pour forcer la réinitialiser des états concernés

---
### 1.4.4

- Prise en compte de l'affichage du type 'date'

---
### 1.4.3

- Ajout d'une référence de chargement du serveur

---
### 1.4.2

- Ajout de la recherche rapide

---
### 1.4.1 

- Les filtres sur les colonnes booléenes utilisent désormais un set de valeur prédéfini

---
### 1.4.0

- Nouvelle doc