import { Query64 } from "./query64";
import { Query64Logger } from "./logger";
export class GridFactory {
    resourceName;
    gridConfig;
    customColumnsMap;
    columnsMetadataMap;
    getRowsFn;
    constructor(resourceName, columnsMetadatas, getRowsFn, gridConfig, additionals, overloads) {
        this.resourceName = resourceName;
        this.getRowsFn = getRowsFn;
        this.columnsMetadataMap = new Map();
        for (const metadata of columnsMetadatas) {
            this.columnsMetadataMap.set(metadata.field_name, metadata);
        }
        this.gridConfig = {
            ...Query64.getGlobalGridConfig(),
            ...gridConfig,
        };
        this.customColumnsMap = new Map();
        columnsMetadatas.forEach((metadata) => {
            let column;
            switch (metadata.field_type) {
                case "string":
                    column = this.getGenericColumnString(metadata);
                    break;
                case "number":
                    column = this.getGenericColumnNumber(metadata);
                    break;
                case "boolean":
                    column = this.getGenericColumnBoolean(metadata);
                    break;
                case "date":
                    column = this.getGenericColumnDate(metadata);
                    break;
                case "datetime":
                    column = this.getGenericColumnDatetime(metadata);
                    break;
                case "object":
                    column = this.getGenericColumnObject(metadata);
                    break;
                default:
                    Query64Logger.tryLog('010', `Field type unkown for column ${metadata.field_name} : ${metadata.field_type}`);
                    column = this.getGenericColumnObject(metadata);
                    break;
            }
            column.hide = metadata.association_type !== null;
            column.cellStyle = this.generateSafeColDefStyle();
            const columnSpecialContext = {
                type: "generated",
            };
            if (metadata.association_type !== null) {
                column.valueGetter = this.getGenericColumnValueGetterRelation(column, metadata);
                if (metadata.association_type === "has_many" ||
                    metadata.association_type === "has_and_belongs_to_many") {
                    column.autoHeight = true;
                    column.cellRenderer = this.gridConfig.columnHasManyRenderComponent;
                }
            }
            const customColumn = GridFactory.generateCustomColumn(column, columnSpecialContext);
            this.customColumnsMap.set(customColumn.colId, customColumn);
        });
        // additionals
        const mergedAdditionals = [
            ...Query64.getGlobalAdditionalColumnsByResourceName(this.resourceName),
            ...(additionals ?? []),
        ];
        for (const additional of mergedAdditionals ?? []) {
            const customColumn = GridFactory.generateCustomColumn(additional.colDef, {
                type: "add",
                dependsOn: additional.dependsOn,
            });
            if (this.customColumnsMap.has(additional.colDef.colId)) {
                Query64Logger.tryLog('011', `You tried to set additional column with id ${additional.colDef.colId} but this id already exists. Action has been ignored.`);
                continue;
            }
            this.customColumnsMap.set(additional.colDef.colId, customColumn);
        }
        // overloads
        const mergedOverloads = [
            ...Query64.getGlobalOverloadColumnsByResourceName(this.resourceName),
            ...(overloads ?? []),
        ];
        for (const overload of mergedOverloads ?? []) {
            const columnToOverload = this.customColumnsMap.get(overload.colDef.colId);
            if (!columnToOverload) {
                Query64Logger.tryLog('012', `You tried to set overload column with id ${overload.colDef.colId} but no column was found. Action has been ignored.`);
                continue;
            }
            const mergedColumn = {
                ...columnToOverload,
                ...overload.colDef,
            };
            const customColumn = GridFactory.generateCustomColumn(mergedColumn, {
                type: "overload",
                dependsOn: overload.dependsOn,
            });
            this.customColumnsMap.set(overload.colDef.colId, customColumn);
        }
        this.detectDeadDepedencies();
    }
    getColumns() {
        return this.customColumnsMap.values().toArray();
    }
    getColumnsByPreferences(preferences) {
        const columnsMapCopy = new Map(this.customColumnsMap);
        const columnFoundMap = new Set();
        const columnOrderMap = new Map();
        for (const preference of preferences) {
            const columnFound = columnsMapCopy.get(preference.colId);
            if (!columnFound) {
                columnFoundMap.add(preference.colId);
                continue;
            }
            columnFound.hide = !preference.visible;
            columnFound.width = preference.width;
            columnFound.pinned = preference.pinned;
            columnOrderMap.set(columnFound.colId, preference.order);
        }
        return columnsMapCopy
            .values()
            .toArray()
            .map((column) => {
            if (!columnFoundMap.has(column.colId)) {
                column.hide = true;
            }
            return column;
        })
            .sort((colA, colB) => {
            return ((columnOrderMap.get(colA.colId) ?? 1000) -
                (columnOrderMap.get(colB.colId) ?? 1000));
        });
    }
    getMetadataByColId(colId) {
        return this.columnsMetadataMap.get(colId);
    }
    getColumnByColId(colId) {
        return this.customColumnsMap.get(colId);
    }
    getColIdList() {
        return this.columnsMetadataMap.keys().toArray();
    }
    getAllColumnDepedencies() {
        console.log(new Set(...this.customColumnsMap
            .values()
            .toArray()
            .map((column) => column.query64Context.dependsOn ?? []))
            .values()
            .toArray());
        return new Set(...this.customColumnsMap
            .values()
            .toArray()
            .map((column) => column.query64Context.dependsOn ?? []))
            .values()
            .toArray();
    }
    columnExist(colId) {
        return this.getColIdList().includes(colId);
    }
    getGenericColumnString(metaData) {
        return {
            headerName: metaData.label_name,
            colId: metaData.field_name,
            valueGetter: (params) => {
                if (!params.data)
                    return "";
                return params.data[metaData.raw_field_name];
            },
            type: "keywordColumn",
            filter: "agTextColumnFilter",
        };
    }
    getGenericColumnNumber(metaData) {
        return {
            headerName: metaData.label_name,
            colId: metaData.field_name,
            valueGetter: (params) => {
                if (!params.data)
                    return "";
                return params.data[metaData.raw_field_name];
            },
            type: "numberColumn",
            filter: "agNumberColumnFilter",
        };
    }
    getGenericColumnDate(metaData) {
        return {
            headerName: metaData.label_name,
            colId: metaData.field_name,
            type: "dateColumn",
            filter: "agDateColumnFilter",
            valueGetter: (params) => {
                if (!params.data ||
                    !params.data[metaData.raw_field_name])
                    return "";
                return this.gridConfig.columnDateFormater(params.data[metaData.raw_field_name]);
            },
            width: 150,
        };
    }
    getGenericColumnDatetime(metaData) {
        return {
            headerName: metaData.label_name,
            colId: metaData.field_name,
            type: "dateColumn",
            filter: "agDateColumnFilter",
            valueGetter: (params) => {
                if (!params.data ||
                    !params.data[metaData.raw_field_name])
                    return "";
                return this.gridConfig.columnDatetimeFormater(params.data[metaData.raw_field_name]);
            },
            width: 150,
        };
    }
    getGenericColumnBoolean(metaData) {
        return {
            headerName: metaData.label_name,
            colId: metaData.field_name,
            type: "booleanColumn",
            valueGetter: (params) => {
                if (!params.data ||
                    params.data[metaData.raw_field_name] === undefined)
                    return "";
                return params.data[metaData.raw_field_name]
                    ? "Oui"
                    : "Non";
            },
            width: 150,
        };
    }
    getGenericColumnObject(metaData) {
        return {
            headerName: metaData.label_name,
            colId: metaData.field_name,
            type: "objectColumn",
            filter: "agTextColumnFilter",
            valueGetter: () => {
                return "";
            },
            width: 150,
        };
    }
    getGenericColumnValueGetterRelation(column, metadata) {
        if (!column.colId) {
            return () => null;
        }
        const baseValueGetter = column.valueGetter;
        const associationType = metadata.association_type;
        const relationName = metadata.association_name;
        if (!relationName ||
            !baseValueGetter ||
            typeof baseValueGetter !== "function") {
            return () => null;
        }
        if (associationType === "has_many" ||
            associationType === "has_and_belongs_to_many") {
            return (params) => {
                if (!params.data || !params.data[relationName]) {
                    return "";
                }
                return params.data[relationName].map((relation) => {
                    return baseValueGetter({ ...params, data: relation });
                });
            };
        }
        if (associationType === "belongs_to" || associationType === "has_one") {
            return (params) => {
                if (!params.data ||
                    !params.data[relationName] ||
                    !Array.isArray(params.data[relationName])) {
                    return "";
                }
                return baseValueGetter({
                    ...params,
                    data: params.data[relationName],
                });
            };
        }
        return () => null;
    }
    generateSafeColDefStyle() {
        return (params) => {
            if (params.data.__id) {
                return {
                    display: "none",
                };
            }
            return {};
        };
    }
    detectDeadDepedencies() {
        const depedencies = this.getAllColumnDepedencies();
        for (const depedency of depedencies) {
            console.log(depedency);
            if (!this.columnExist(depedency)) {
                Query64Logger.tryLog('013', `Column with id ${depedency} has been register as depedency but does not exist in the column pool.`);
            }
        }
    }
    static generateCustomColumn(column, query64Context) {
        return {
            ...column,
            colId: column.colId,
            query64Context,
            context: {},
        };
    }
    static formatDateFn(dateValue) {
        const date = new Date(dateValue);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return ((day < 10 ? "0" : "") +
            day +
            "/" +
            (month < 10 ? "0" : "") +
            month +
            "/" +
            year);
    }
    static formatDatetimeFn(dateValue) {
        const date = new Date(dateValue);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        return ((day < 10 ? "0" : "") +
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
                ((minutes < 10 ? "0" : "") + minutes)));
    }
    static defaultColumnTypesConfig() {
        return {
            textColumn: {
                floatingFilter: true,
                resizable: true,
                sortable: true,
                enableRowGroup: true,
                columnGroupShow: "open",
                filter: "agTextColumnFilter",
                filterParams: {
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
                filterParams: {
                    filterOptions: [
                        "contains",
                        "equals",
                        "notEqual",
                        "notContains",
                        {
                            displayKey: "blank",
                            displayName: "Vide",
                            predicate: function (_, cellValue) {
                                return String(cellValue).length === 0;
                            },
                            numberOfInputs: 0,
                        },
                        {
                            displayKey: "notEmpty",
                            displayName: "Non vide",
                            predicate: function (_, cellValue) {
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
                filterParams: {
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
                filterParams: {
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
                filterParams: {
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
                filterParams: {
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
                    valueFormatter: (params) => {
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
    static defaultGridStyle() {
        return "height: 100%; width: 100%; box-shadow: 0 1px 8px rgba(0, 0, 0, 0.2), 0 3px 4px rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12);";
    }
    static defaultContainerStyle() {
        return "display: flex; flex-direction: column; height: 100%";
    }
    static getFrenchTranslate() {
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
            rowGroupColumnsEmptyMessage: "Glissez les colonnes ici pour faire des regroupements",
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
