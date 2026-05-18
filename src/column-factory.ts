import type {
  CellClassParams,
  CellStyle,
  ColDef,
  ValueGetterFunc,
} from "ag-grid-enterprise";
import type {
  TColumnProfil as TColumnPreference,
  TCustomColumn,
  TQuery64Config,
  TCustomColId,
  TColumnQuery64Context,
  TCustomColumnRegistration,
  TResourceColumnMetaData,
} from "./models";
import { Query64 } from "./query64";
import type {
  TRecord,
} from "./private-models";
import { Query64Logger } from "./logger";

export class ColumnFactory {
  resourceName: string;
  config: TQuery64Config;
  customColumnsMap: Map<TCustomColId, TCustomColumn>;
  columnsMetadataMap: Map<TCustomColId, TResourceColumnMetaData>;

  constructor(
    resourceName: string,
    columnsMetadatas: TResourceColumnMetaData[],
    config?: TQuery64Config,
    additionals?: TCustomColumnRegistration[],
    overloads?: TCustomColumnRegistration[],
  ) {
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
      let column: ColDef<TRecord>;
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
          Query64Logger.tryLog(
            `Field type unkown for column ${metadata.field_name} : ${metadata.field_type}`,
          );
          column = this.getGenericColumnObject(metadata);
          break;
      }
      column.hide = metadata.association_type !== null;
      column.cellStyle = this.generateSafeColDefStyle();
      const columnSpecialContext: TColumnQuery64Context = {
        type: "generated",
      };
      if (metadata.association_type !== null) {
        column.valueGetter = this.getGenericColumnValueGetterRelation(
          column,
          metadata,
        );
        if (
          metadata.association_type === "has_many" ||
          metadata.association_type === "has_and_belongs_to_many"
        ) {
          column.autoHeight = true;
          column.cellRenderer = this.config.columnHasManyRenderComponent;
        }
      }
      const customColumn = ColumnFactory.generateCustomColumn(
        column,
        columnSpecialContext,
      );
      this.customColumnsMap.set(customColumn.colId, customColumn);
    });

    // additionals
    const mergedAdditionals = [
      ...Query64.getGlobalAdditionalColumnsByResourceName(this.resourceName),
      ...(additionals ?? []),
    ];
    for (const additional of mergedAdditionals ?? []) {
      const customColumn = ColumnFactory.generateCustomColumn(
        additional.colDef,
        {
          type: "add",
          dependsOn: additional.dependsOn,
        },
      );
      if (this.customColumnsMap.has(additional.colDef.colId)) {
        Query64Logger.tryLog(
          `You tried to set additional column with id ${additional.colDef.colId} but this id already exists. Action has been ignored.`,
        );
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
        Query64Logger.tryLog(
          `You tried to set overload column with id ${overload.colDef.colId} but no column was found. Action has been ignored.`,
        );
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
  getColumnsByProfils(preferences: TColumnPreference[]): TCustomColumn[] {
    const columnsMapCopy = new Map(this.customColumnsMap);
    const columnFoundMap = new Set<TCustomColId>();
    const columnOrderMap = new Map<TCustomColId, number>();
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
        return (
          (columnOrderMap.get(colA.colId) ?? 1000) -
          (columnOrderMap.get(colB.colId) ?? 1000)
        );
      });
  }
  getMetadataByColId(colId: TCustomColId) {
    return this.columnsMetadataMap.get(colId);
  }
  getColumnByColId(colId: TCustomColId) {
    return this.customColumnsMap.get(colId);
  }
  getColIdList() {
    return this.columnsMetadataMap.keys().toArray();
  }
  getAllColumnDepedencies() {
    return new Set(
      ...this.customColumnsMap
        .values()
        .toArray()
        .map((column) => column.query64Context.dependsOn ?? [])
        .flat(),
    )
      .keys()
      .toArray();
  }
  columnExist(colId: TCustomColId) {
    return this.getColIdList().includes(colId);
  }

  private getGenericColumnString(
    metaData: TResourceColumnMetaData,
  ): ColDef<TRecord> {
    return {
      headerName: metaData.label_name,
      colId: metaData.field_name,
      valueGetter: (params) => {
        if (!params.data) return "";
        return params.data[metaData.raw_field_name as keyof TRecord];
      },
      type: "keywordColumn",
      filter: "agTextColumnFilter",
    };
  }
  private getGenericColumnNumber(
    metaData: TResourceColumnMetaData,
  ): ColDef<TRecord> {
    return {
      headerName: metaData.label_name,
      colId: metaData.field_name,
      valueGetter: (params) => {
        if (!params.data) return "";
        return params.data[metaData.raw_field_name as keyof TRecord];
      },
      type: "numberColumn",
      filter: "agNumberColumnFilter",
    };
  }
  private getGenericColumnDate(
    metaData: TResourceColumnMetaData,
  ): ColDef<TRecord> {
    return {
      headerName: metaData.label_name,
      colId: metaData.field_name,
      type: "dateColumn",
      filter: "agDateColumnFilter",
      valueGetter: (params) => {
        if (
          !params.data ||
          !params.data[metaData.raw_field_name as keyof TRecord]
        )
          return "";
        return this.config.columnDateFormater!(
          params.data[metaData.raw_field_name as keyof TRecord] as string,
        );
      },
      width: 150,
    };
  }
  private getGenericColumnDatetime(
    metaData: TResourceColumnMetaData,
  ): ColDef<TRecord> {
    return {
      headerName: metaData.label_name,
      colId: metaData.field_name,
      type: "dateColumn",
      filter: "agDateColumnFilter",
      valueGetter: (params) => {
        if (
          !params.data ||
          !params.data[metaData.raw_field_name as keyof TRecord]
        )
          return "";
        return this.config.columnDatetimeFormater!(
          params.data[metaData.raw_field_name as keyof TRecord] as string,
        );
      },
      width: 150,
    };
  }
  private getGenericColumnBoolean(
    metaData: TResourceColumnMetaData,
  ): ColDef<TRecord> {
    return {
      headerName: metaData.label_name,
      colId: metaData.field_name,
      type: "booleanColumn",
      valueGetter: (params) => {
        if (
          !params.data ||
          params.data[metaData.raw_field_name as keyof TRecord] === undefined
        )
          return "";
        return params.data[metaData.raw_field_name as keyof TRecord]
          ? "Oui"
          : "Non";
      },
      width: 150,
    };
  }
  private getGenericColumnObject(
    metaData: TResourceColumnMetaData,
  ): ColDef<TRecord> {
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
  private getGenericColumnValueGetterRelation(
    column: ColDef<TRecord>,
    metadata: TResourceColumnMetaData,
  ): ValueGetterFunc<TRecord> {
    if (!column.colId) {
      return () => null;
    }
    const baseValueGetter = column.valueGetter;
    const associationType = metadata.association_type;
    const relationName = metadata.association_name;
    if (
      !relationName ||
      !baseValueGetter ||
      typeof baseValueGetter !== "function"
    ) {
      return () => null;
    }
    if (
      associationType === "has_many" ||
      associationType === "has_and_belongs_to_many"
    ) {
      return (params) => {
        if (!params.data || !params.data[relationName]) {
          return "";
        }
        return (params.data[relationName] as Record<string, unknown>[]).map(
          (relation) => {
            return baseValueGetter({ ...params, data: relation as TRecord });
          },
        );
      };
    }
    if (associationType === "belongs_to" || associationType === "has_one") {
      return (params) => {
        if (
          !params.data ||
          !params.data[relationName] ||
          !Array.isArray(params.data[relationName])
        ) {
          return "";
        }
        return baseValueGetter({
          ...params,
          data: params.data[relationName] as unknown as TRecord,
        });
      };
    }
    return () => null;
  }
  private generateSafeColDefStyle() {
    return (params: CellClassParams) => {
      if (params.data.__id) {
        return {
          display: "none",
        } as CellStyle;
      }
      return {};
    };
  }
  private detectDeadDepedencies() {
    const depedencies = this.getAllColumnDepedencies();
    for (const depedency of depedencies) {
      if (!this.columnExist(depedency)) {
        Query64Logger.tryLog(
          `Column with id ${depedency} has been register as depedency but does not exist in the column pool.`,
        );
      }
    }
  }
  static generateCustomColumn(
    column: ColDef<TRecord>,
    query64Context: TColumnQuery64Context,
  ): TCustomColumn {
    return {
      ...column,
      colId: column.colId!,
      query64Context,
      context: {},
    };
  }
}
