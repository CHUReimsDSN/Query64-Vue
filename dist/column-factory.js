import { Query64 } from "./query64";
import CellDefaultListValue from "./CellDefaultListValue.vue";
export class ColumnFactory {
    static getColumnTypesDefaultConfig() {
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
    resourceName;
    globalColumnSettings;
    hasManyColumnSettings;
    actionColumnSettings;
    overloadSettings;
    additionalSettings;
    constructor(resourceName, globalColumnProps, hasManyColumnProps, actionColumnProps, overloadProps, additionalProps) {
        this.resourceName = resourceName;
        this.globalColumnSettings = {
            columnTypeConfig: globalColumnProps?.columnTypeConfig ??
                Query64.getColumnTypesGlobalConfig(),
            columnDateFormater: globalColumnProps?.columnDateFormater ??
                ((dateValue) => {
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
                }),
        };
        this.hasManyColumnSettings = hasManyColumnProps ?? {
            purgeNullValue: false,
            customComponent: CellDefaultListValue,
        };
        this.actionColumnSettings = actionColumnProps;
        this.overloadSettings = overloadProps ?? [];
        Query64.getColumnOverloadsByResourceName(this.resourceName).forEach((overload) => {
            this.overloadSettings.push(overload);
        });
        this.additionalSettings = additionalProps ?? [];
        Query64.getColumnAdditionalsByResourceName(this.resourceName).forEach((additional) => {
            this.additionalSettings.push(additional);
        });
    }
    getResourceColumnsDefault(resourceMetaDatas, resourceName) {
        return this.getAllResourceColumns(resourceMetaDatas, resourceName);
    }
    getResourceColumnsByProfils(columnData, resourceMetaDatas, resourceName) {
        const allColumns = this.getAllResourceColumns(resourceMetaDatas, resourceName);
        let allColumnsInOrder = allColumns;
        allColumnsInOrder.forEach((resourceColumn) => {
            const foundedColumn = columnData.find((profilColumn) => {
                return resourceColumn.colId === profilColumn.field_name;
            });
            if (!foundedColumn) {
                resourceColumn.hide = true;
            }
            else {
                resourceColumn.hide = !foundedColumn.visible;
                resourceColumn.width = foundedColumn.width;
                if (resourceColumn.context) {
                    resourceColumn.context.order = foundedColumn.order;
                }
            }
        });
        allColumnsInOrder = allColumnsInOrder.filter((columnInOrder) => {
            return columnInOrder;
        });
        allColumnsInOrder = allColumnsInOrder.sort((colA, colB) => {
            return Number(colA.context?.order) - Number(colB.context?.order);
        });
        return allColumnsInOrder;
    }
    getAllResourceColumns(resourceMetaDatas, resourceName) {
        const columns = [];
        resourceMetaDatas.forEach((metadata) => {
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
                case "object":
                    column = this.getGenericColumnObject(metadata);
                    break;
            }
            if (!column.context) {
                column.context = {};
            }
            column.hide = metadata.association_type !== null;
            column.cellStyle = this.generateSafeColDefStyle();
            if (metadata.raw_field_name === "id")
                column.enableRowGroup = false;
            if (metadata.association_type !== null) {
                column.valueGetter = this.getGenericColumnValueGetterRelation(column);
                if (metadata.association_type === "has_many") {
                    column.autoHeight = true;
                    column.cellRenderer =
                        this.hasManyColumnSettings.customComponent ?? CellDefaultListValue;
                }
            }
            const overload = this.overloadSettings.find((overloadSetting) => {
                return (overloadSetting.resourceColumnRegister.columnName ===
                    metadata.raw_field_name &&
                    (overloadSetting.resourceColumnRegister.associationName ===
                        metadata.association_name ||
                        (overloadSetting.resourceColumnRegister.associationName ===
                            undefined &&
                            metadata.association_name === null)));
            });
            if (overload) {
                column = overload.colDef;
                if (!column.colId) {
                    column.colId = column.field ?? column.headerName;
                }
                if (!column.context) {
                    column.context = {};
                }
            }
            columns.push(column);
        });
        if (this.actionColumnSettings?.defaultComponent) {
            columns.push(this.getGenericColumnAction(resourceName, this.actionColumnSettings.defaultComponent));
        }
        this.additionalSettings.forEach((additionalSetting) => {
            const colDef = additionalSetting.colDef;
            colDef.cellStyle = this.generateSafeColDefStyle();
            if (!colDef.colId) {
                colDef.colId = colDef.field ?? colDef.headerName;
            }
            if (!colDef.context) {
                colDef.context = {};
            }
            columns.push(colDef);
        });
        return columns;
    }
    getGenericColumnAction(resourceName, cellComponent) {
        return {
            headerName: "Actions",
            type: "actionColumn",
            colId: "defaultActions",
            cellRenderer: cellComponent,
            cellRendererParams: {
                resourceName,
            },
            width: 107,
            context: {},
            cellStyle: this.generateSafeColDefStyle(),
        };
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
                if (!params.data || !params.data[metaData.raw_field_name])
                    return "";
                return this.globalColumnSettings.columnDateFormater(params.data[metaData.raw_field_name]);
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
                return params.data[metaData.raw_field_name] ? "Oui" : "Non";
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
    getGenericColumnValueGetterRelation(column) {
        if (!column.colId)
            return () => null;
        const baseValueGetter = column.valueGetter;
        const colIdMacro = column.colId.split("::").at(-1);
        const colIdRelation = column.colId.split(".").at(0);
        if (!colIdRelation ||
            !baseValueGetter ||
            typeof baseValueGetter !== "function") {
            return () => null;
        }
        if (colIdMacro === "has_many" || colIdMacro === "has_and_belongs_to_many") {
            return (params) => {
                if (!params.data || !params.data[colIdRelation]) {
                    return "";
                }
                return params.data[colIdRelation].map((relation) => {
                    return baseValueGetter({ ...params, data: relation });
                });
            };
        }
        if (colIdMacro === "belongs_to" || colIdMacro === "has_one") {
            return (params) => {
                if (!params.data ||
                    !params.data[colIdRelation] ||
                    !Array.isArray(params.data[colIdRelation])) {
                    return "";
                }
                return baseValueGetter({
                    ...params,
                    data: params.data[colIdRelation][0],
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
}
