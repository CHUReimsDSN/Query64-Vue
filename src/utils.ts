import type {
  ColDef,
  IDateFilterParams,
  INumberFilterParams,
  ITextFilterParams,
} from "ag-grid-community";
import type { TRecord } from "./private-models";

export abstract class Utils {
  static formatDate(dateValue: string | Date) {
    const date = new Date(dateValue);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return (
      (day < 10 ? "0" : "") +
      day +
      "/" +
      (month < 10 ? "0" : "") +
      month +
      "/" +
      year
    );
  }
  static formatDatetime(dateValue: string | Date) {
    const date = new Date(dateValue);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return (
      (day < 10 ? "0" : "") +
      day +
      "/" +
      (month < 10 ? "0" : "") +
      month +
      "/" +
      year +
      " " +
      ((hour < 10 ? "0" : "") +
        hour +
        ":" +
        ((minutes < 10 ? "0" : "") + minutes))
    );
  }
  static columnTypesConfig(): Record<string, ColDef<TRecord>> {
    return {
      textColumn: {
        floatingFilter: true,
        resizable: true,
        sortable: true,
        enableRowGroup: true,
        columnGroupShow: "open",
        filter: "agTextColumnFilter",
        filterParams: <ITextFilterParams>{
          filterOptions: ["contains", "notContains"],
        },
        mainMenuItems: [
          "sortAscending",
          "sortDescending",
          "columnChooser",
          "rowGroup",
          "pinSubMenu",
        ],
      },
      keywordColumn: {
        floatingFilter: true,
        resizable: true,
        sortable: true,
        enableRowGroup: true,
        columnGroupShow: "open",
        filter: "agTextColumnFilter",
        filterParams: <ITextFilterParams>{
          filterOptions: [
            "contains",
            "equals",
            "notEqual",
            "notContains",
            {
              displayKey: "blank",
              displayName: "Vide",
              predicate: function (
                _: null,
                cellValue: string | null | undefined,
              ) {
                return String(cellValue).length === 0;
              },
              numberOfInputs: 0,
            },
            {
              displayKey: "notEmpty",
              displayName: "Non vide",
              predicate: function (
                _: null,
                cellValue: string | null | undefined,
              ) {
                return String(cellValue).length > 0;
              },
              numberOfInputs: 0,
            },
          ],
        },
        mainMenuItems: [
          "sortAscending",
          "sortDescending",
          "columnChooser",
          "rowGroup",
          "pinSubMenu",
        ],
      },
      floatColumn: {
        floatingFilter: true,
        resizable: true,
        sortable: true,
        enableRowGroup: true,
        columnGroupShow: "open",
        filter: "agNumberColumnFilter",
        filterParams: <INumberFilterParams>{
          filterOptions: ["contains", "equals", "greaterThan", "lessThan"],
        },
        mainMenuItems: [
          "sortAscending",
          "sortDescending",
          "columnChooser",
          "rowGroup",
          "pinSubMenu",
        ],
      },
      numberColumn: {
        floatingFilter: true,
        resizable: true,
        sortable: true,
        enableRowGroup: true,
        columnGroupShow: "open",
        filter: "agNumberColumnFilter",
        filterParams: <INumberFilterParams>{
          filterOptions: ["equals", "greaterThan", "lessThan", "inRange"],
        },
        mainMenuItems: [
          "sortAscending",
          "sortDescending",
          "columnChooser",
          "rowGroup",
          "pinSubMenu",
        ],
      },
      dateColumn: {
        floatingFilter: true,
        resizable: true,
        sortable: true,
        enableRowGroup: true,
        columnGroupShow: "open",
        filter: "agDateColumnFilter",
        filterParams: <IDateFilterParams>{
          buttons: ["reset"],
          browserDatePicker: true,
          filterOptions: [
            "equals",
            "notEqual",
            "inRange",
            "greaterThan",
            "lessThan",
          ],
        },
        mainMenuItems: [
          "sortAscending",
          "sortDescending",
          "columnChooser",
          "rowGroup",
          "pinSubMenu",
        ],
      },
      datetimeColumn: {
        floatingFilter: true,
        resizable: true,
        sortable: true,
        enableRowGroup: true,
        columnGroupShow: "open",
        filter: "agDateColumnFilter",
        filterParams: <IDateFilterParams>{
          buttons: ["reset"],
          browserDatePicker: true,
          filterOptions: [
            "equals",
            "notEqual",
            "inRange",
            "greaterThan",
            "lessThan",
          ],
        },
        mainMenuItems: [
          "sortAscending",
          "sortDescending",
          "columnChooser",
          "rowGroup",
          "pinSubMenu",
        ],
      },
      booleanColumn: {
        floatingFilter: true,
        resizable: true,
        sortable: true,
        enableRowGroup: true,
        columnGroupShow: "open",
        filter: "agSetColumnFilter",
        filterParams: {
          values: [true, false, "null"],
          suppressSorting: true,
          valueFormatter: (params: { value: string | boolean }) => {
            if (params.value === true) {
              return "Oui";
            }
            if (params.value === false) {
              return "Non";
            }
            if (params.value === "null") {
              return "Vide";
            }
            return "???";
          },
        },
        mainMenuItems: [
          "sortAscending",
          "sortDescending",
          "columnChooser",
          "rowGroup",
          "pinSubMenu",
        ],
      },
      objectColumn: {
        floatingFilter: false,
        filter: false,
        sortable: false,
        resizable: true,
        autoHeight: true,
        suppressHeaderFilterButton: true,
        columnGroupShow: "open",
        mainMenuItems: ["columnChooser"],
      },
      actionColumn: {
        resizable: false,
        initialHide: false,
        hide: false,
        floatingFilter: false,
        sortable: false,
        pinned: "right",
        columnGroupShow: "open",
        cellClass: "flex flex-center row no-wrap",
        mainMenuItems: ["columnChooser"],
      },
    };
  }
  static gridStyle() {
    return "box-shadow: 0 1px 8px rgba(0, 0, 0, 0.2), 0 3px 4px rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12);";
  }
  static getFrenchTranslate(): Record<string, string> {
    return {
      selectAll: "(Tout sélectionner)",
      selectAllSearchResults: "(Sélectionner tous les résultats)",
      searchOoo: "Recherche…",
      blanks: "(Vides)",
      noMatches: "Aucun résultat",
      filterOoo: "Filtrage...",
      equals: "Égal",
      notEqual: "Différent",
      empty: "Vide",
      notEmpty: "Non vide",
      lessThan: "Inférieur",
      greaterThan: "Supérieur",
      lessThanOrEqual: "Inférieur ou égal",
      greaterThanOrEqual: "Supérieur ou égal",
      after: "Après",
      before: "Avant",
      inRange: "Entre",
      inRangeStart: "de",
      inRangeEnd: "à",
      contains: "Contient",
      notContains: "Ne contient pas",
      startsWith: "Commence par",
      endsWith: "Termine par",
      dateFormatOoo: "DD/MM/YYYY",
      andCondition: "ET",
      orCondition: "OU",
      applyFilter: "Appliquer",
      resetFilter: "RÀZ",
      clearFilter: "Effacer",
      cancelFilter: "Annuler",
      textFilter: "Filtre Texte",
      numberFilter: "Filtre Nombre",
      dateFilter: "Filtre Date",
      setFilter: "Filtre Ensemble",
      columns: "Colonnes",
      filters: "Filtres",
      pivotMode: "Mode Pivot",
      groups: "Groupes de lignes",
      rowGroupColumnsEmptyMessage:
        "Glissez les colonnes ici pour faire des regroupements",
      values: "Valeurs",
      valueColumnsEmptyMessage: "Glissez ici pour aggréger",
      pivots: "Noms des colonnes",
      pivotColumnsEmptyMessage: "Glissez ici pour définir les noms de colonnes",
      group: "Regroupement",
      loadingOoo: "Chargement...",
      noRowsToShow: "Aucune ligne",
      enabled: "Activé",
      pinColumn: "Épingler la colonne",
      pinLeft: "À gauche",
      pinRight: "À droite",
      noPin: "Nulle part",
      valueAggregation: "Aggregation de valeurs",
      autosizeThiscolumn: "Autodimensionner cette colonne",
      autosizeAllColumns: "Autodimensionner toutes les colonnes",
      groupBy: "Grouper par",
      ungroupBy: "Dégrouper par",
      resetColumns: "RÀZ des colonnes",
      expandAll: "Tout déplier",
      collapseAll: "Tout replier",
      copy: "Copier",
      ctrlC: "Ctrl+C",
      copyWithGroupHeaders: "Copier avec les entêtes groupées",
      copyWithHeaders: "Copier avec les entêtes",
      paste: "Coller",
      ctrlV: "Ctrl+V",
      export: "Exporter",
      csvExport: "CSV Export",
      excelExport: "Excel Export (.xlsx)",
      excelXmlExport: "Excel Export (.xml)",
      sum: "Somme",
      min: "Min",
      max: "Max",
      none: "Aucun",
      count: "Count",
      avg: "Moyenne",
      filteredRows: "Filtré",
      selectedRows: "Selectionné",
      totalRows: "Nb lignes total",
      totalAndFilteredRows: "Lignes",
      more: "Plus",
      to: "à",
      of: "sur",
      page: "Page",
      nextPage: "Page suivante",
      lastPage: "Dernière page",
      firstPage: "Première page",
      previousPage: "Page précédente",
      pivotChartAndPivotMode: "Pivot Chart & Pivot Mode",
      pivotChart: "Pivot Chart",
      chartRange: "Graphique sur une plage",
      columnChart: "Colonne",
      groupedColumn: "Groupé",
      stackedColumn: "Empilé",
      normalizedColumn: "100% Empilé",
      barChart: "Barre",
      groupedBar: "Groupé",
      stackedBar: "Empilé",
      normalizedBar: "100% Empilé",
      pieChart: "Circulaire",
      pie: "Circulaire",
      doughnut: "Anneau",
      line: "Ligne",
      xyChart: "X Y (Dispersion)",
      scatter: "Dispersion",
      bubble: "Bulles",
      areaChart: "Aires",
      area: "Aires",
      stackedArea: "Empilé",
      normalizedArea: "100% Empilé",
      histogramChart: "Histogramme",
      pivotChartTitle: "Pivot Chart",
      rangeChartTitle: "Range Chart",
      settings: "Settings",
      data: "Data",
      format: "Format",
      categories: "Categories",
      defaultCategory: "(None)",
      series: "Series",
      xyValues: "X Y Values",
      paired: "Paired Mode",
      axis: "Axis",
      navigator: "Navigator",
      color: "Color",
      thickness: "Thickness",
      xType: "X Type",
      automatic: "Automatic",
      category: "Category",
      number: "Number",
      time: "Time",
      xRotation: "X Rotation",
      yRotation: "Y Rotation",
      ticks: "Ticks",
      width: "Width",
      height: "Height",
      length: "Length",
      padding: "Padding",
      spacing: "Spacing",
      chart: "Chart",
      title: "Title",
      titlePlaceholder: "Chart title - double click to edit",
      background: "Background",
      font: "Font",
      top: "Haut",
      right: "Droit",
      bottom: "Bas",
      left: "Gauche",
      labels: "Labels",
      size: "Size",
      minSize: "Minimum Size",
      maxSize: "Maximum Size",
      legend: "Legend",
      position: "Position",
      markerSize: "Marker Size",
      markerStroke: "Marker Stroke",
      markerPadding: "Marker Padding",
      itemSpacing: "Item Spacing",
      itemPaddingX: "Item Padding X",
      itemPaddingY: "Item Padding Y",
      layoutHorizontalSpacing: "Horizontal Spacing",
      layoutVerticalSpacing: "Vertical Spacing",
      strokeWidth: "Stroke Width",
      offset: "Offset",
      offsets: "Offsets",
      tooltips: "Tooltips",
      callout: "Callout",
      markers: "Markers",
      shadow: "Shadow",
      blur: "Blur",
      xOffset: "X Offset",
      yOffset: "Y Offset",
      lineWidth: "Line Width",
      normal: "Normal",
      bold: "Bold",
      italic: "Italic",
      boldItalic: "Bold Italic",
      predefined: "Predefined",
      fillOpacity: "Fill Opacity",
      strokeOpacity: "Line Opacity",
      histogramBinCount: "Bin count",
      columnGroup: "Column",
      barGroup: "Bar",
      pieGroup: "Pie",
      lineGroup: "Line",
      scatterGroup: "X Y (Scatter)",
      areaGroup: "Area",
      histogramGroup: "Histogram",
      groupedColumnTooltip: "Grouped",
      stackedColumnTooltip: "Stacked",
      normalizedColumnTooltip: "100% Stacked",
      groupedBarTooltip: "Grouped",
      stackedBarTooltip: "Stacked",
      normalizedBarTooltip: "100% Stacked",
      pieTooltip: "Pie",
      doughnutTooltip: "Doughnut",
      lineTooltip: "Line",
      groupedAreaTooltip: "Area",
      stackedAreaTooltip: "Stacked",
      normalizedAreaTooltip: "100% Stacked",
      scatterTooltip: "Scatter",
      bubbleTooltip: "Bubble",
      histogramTooltip: "Histogram",
      noDataToChart: "No data available to be charted.",
      pivotChartRequiresPivotMode: "Pivot Chart requires Pivot Mode enabled.",
      rowDragRow: "ligne",
      rowDragRows: "lignes",
      sortAscending: "Tri ascendant",
      sortDescending: "Tri descendant",
      columnChooser: "Choix des colonnes",
      chooseColumns: "Choisir des colonnes",
    };
  }
}
