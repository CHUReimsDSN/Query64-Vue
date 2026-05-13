import { Query64 } from "./query64";
import { Logger } from "./logger";
export class ColumnFactory {
    resourceName;
    config;
    customColumnsMap;
    columnsMetadataMap;
    constructor(resourceName, columnsMetadatas, config, additionals, overloads) {
        this.resourceName = resourceName;
        this.columnsMetadataMap = new Map();
        for (const metadata of columnsMetadatas) {
            this.columnsMetadataMap.set(metadata.field_name, metadata);
        }
        this.config = {
            ...Query64.getGlobalConfig(),
            ...config,
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
                    Logger.tryLog(`Field type unkown for column ${metadata.field_name} : ${metadata.field_type}`);
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
                    column.cellRenderer = this.config.columnHasManyRenderComponent;
                }
            }
            const customColumn = ColumnFactory.generateCustomColumn(column, columnSpecialContext);
            this.customColumnsMap.set(customColumn.colId, customColumn);
        });
        // additionals
        const mergedAdditionals = [
            ...Query64.getGlobalAdditionalColumnsByResourceName(this.resourceName),
            ...(additionals ?? []),
        ];
        for (const additional of mergedAdditionals ?? []) {
            const customColumn = ColumnFactory.generateCustomColumn(additional.colDef, {
                type: "add",
                dependsOn: additional.dependsOn,
            });
            if (this.customColumnsMap.has(additional.colDef.colId)) {
                Logger.tryLog(`You tried to set additional column with id ${additional.colDef.colId} but this id already exists. Action has been ignored.`);
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
                Logger.tryLog(`You tried to set overload column with id ${overload.colDef.colId} but no column was found. Action has been ignored.`);
                continue;
            }
            const mergedColumn = {
                ...columnToOverload,
                ...overload.colDef,
            };
            const customColumn = ColumnFactory.generateCustomColumn(mergedColumn, {
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
    getColumnsByProfils(preferences) {
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
        return new Set(...this.customColumnsMap
            .values()
            .toArray()
            .map((column) => column.query64Context.dependsOn ?? [])
            .flat())
            .keys()
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
                return this.config.columnDateFormater(params.data[metaData.raw_field_name]);
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
                return this.config.columnDatetimeFormater(params.data[metaData.raw_field_name]);
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
            if (!this.columnExist(depedency)) {
                Logger.tryLog(`Column with id ${depedency} has been register as depedency but does not exist in the column pool.`);
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
}
