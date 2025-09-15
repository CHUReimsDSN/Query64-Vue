import type {
  ColDef,
  IDateFilterParams,
  INumberFilterParams,
  ITextFilterParams,
  TextMatcherParams,
  ValueGetterFunc,
} from "ag-grid-enterprise";
import {
  TResourceColumnProfil,
  TResourceColumnMetaData,
  TAdditionalsProps,
  TOverloadsProps,
  TGlobalColumnProps,
  THasManyColumnProps,
  TActionColumnProps,
} from "./models";
import { Query64 } from "./query64";
import { Component } from "vue";
import CellDefaultListValue from "./CellDefaultListValue.vue";

export class ColumnFactory {
  private static getColumnTypesDefaultConfig(): Record<string, ColDef> {
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
                cellValue: string | null | undefined
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
                cellValue: string | null | undefined
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
      booleanColumn: {
        floatingFilter: true,
        resizable: true,
        sortable: true,
        enableRowGroup: true,
        columnGroupShow: "open",
        filter: "agTextColumnFilter",
        filterParams: <ITextFilterParams>{
          filterOptions: ["equals"],
          suppressAndOrCondition: true,
          textMatcher: (params: TextMatcherParams) => {
            if (!params.filterText) return true;
            const normalizedFilter = params.filterText.trim().toLowerCase();
            const ouiVariants = ["oui", "ou", "o", "true"];
            const nonVariants = ["non", "no", "n", "false"];
            if (ouiVariants.includes(normalizedFilter))
              return params.value === true;
            if (nonVariants.includes(normalizedFilter))
              return params.value === false;
            return false;
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
        cellClass: "bg-grey-2 flex flex-center row no-wrap",
        mainMenuItems: ["columnChooser"],
      },
    };
  }

  resourceName: string;
  globalColumnSettings: TGlobalColumnProps & {
    columnTypeConfig: Record<string, ColDef>;
  };
  hasManyColumnSettings: THasManyColumnProps;
  actionColumnSettings?: TActionColumnProps;
  overloadSettings: TOverloadsProps[];
  additionalSettings: TAdditionalsProps[];

  constructor(
    resourceName: string,
    globalColumnProps?: TGlobalColumnProps,
    hasManyColumnProps?: THasManyColumnProps,
    actionColumnProps?: TActionColumnProps,
    overloadProps?: TOverloadsProps[],
    additionalProps?: TAdditionalsProps[]
  ) {
    this.resourceName = resourceName;
    if (
      globalColumnProps &&
      globalColumnProps?.columnTypeConfig === undefined
    ) {
      globalColumnProps.columnTypeConfig =
        ColumnFactory.getColumnTypesDefaultConfig();
    }
    this.globalColumnSettings = {
      columnTypeConfig:
        globalColumnProps?.columnTypeConfig ??
        ColumnFactory.getColumnTypesDefaultConfig(),
      columnDateFormater:
        globalColumnProps?.columnDateFormater ??
        ((dateValue: string | Date) => {
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
        }),
    };
    this.hasManyColumnSettings = hasManyColumnProps ?? {
      purgeNullValue: false,
      customComponent: CellDefaultListValue,
    };
    this.actionColumnSettings = actionColumnProps;
    this.overloadSettings = overloadProps ?? [];
    Query64.getColumnOverloadsByResourceName(this.resourceName).forEach(
      (overload) => {
        this.overloadSettings.push(overload);
      }
    );
    this.additionalSettings = additionalProps ?? [];
    Query64.getColumnAdditionalsByResourceName(this.resourceName).forEach(
      (additional) => {
        this.additionalSettings.push(additional);
      }
    );
  }

  getResourceColumnsDefault<T>(
    resourceMetaDatas: TResourceColumnMetaData[],
    resourceName: string
  ): ColDef<T>[] {
    return this.getAllResourceColumns(resourceMetaDatas, resourceName);
  }
  getResourceColumnsByProfils<T>(
    columnData: TResourceColumnProfil[],
    resourceMetaDatas: TResourceColumnMetaData[],
    resourceName: string
  ): ColDef<T>[] {
    const allColumns = this.getAllResourceColumns<T>(
      resourceMetaDatas,
      resourceName
    );
    let allColumnsInOrder = allColumns;
    allColumnsInOrder.forEach((resourceColumn) => {
      if (resourceColumn.colId === "defaultActions") return;
      const foundedColumn = columnData.find((profilColumn) => {
        return resourceColumn.colId === profilColumn.field_name;
      });
      if (!foundedColumn) {
        resourceColumn.hide = true;
      } else {
        resourceColumn.hide = !foundedColumn.visible;
        resourceColumn.width = foundedColumn.width;
        resourceColumn.context.order = foundedColumn.order;
      }
    });
    allColumnsInOrder = allColumnsInOrder.sort((colA, colB) => {
      return Number(colA.context?.order) - Number(colB.context?.order);
    });
    allColumnsInOrder = allColumnsInOrder.filter((columnInOrder) => {
      return columnInOrder;
    });
    return allColumnsInOrder;
  }

  private getAllResourceColumns<T>(
    resourceMetaDatas: TResourceColumnMetaData[],
    resourceName: string
  ): ColDef<T>[] {
    const columns: ColDef<T>[] = [];
    resourceMetaDatas.forEach((metadata) => {
      let column: ColDef<T>;
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
      if (!column.context) column.context = {};
      column.hide = metadata.association_type !== null;
      if (metadata.raw_field_name === "id") column.enableRowGroup = false;
      if (metadata.association_type !== null) {
        column.valueGetter = this.getGenericColumnValueGetterRelation(column);
        if (metadata.association_type === "has_many") {
          column.autoHeight = true;
          column.cellRenderer =
            this.hasManyColumnSettings.customComponent ?? CellDefaultListValue;
        }
      }
      const overload = this.overloadSettings.find((overloadSetting) => {
        return (
          overloadSetting.resourceColumnRegister.columnName ===
            metadata.raw_field_name &&
          (overloadSetting.resourceColumnRegister.associationName ===
            metadata.association_name ||
            (overloadSetting.resourceColumnRegister.associationName ===
              undefined &&
              metadata.association_name === null))
        );
      });
      if (overload) {
        column = overload.colDef;
      }
      columns.push(column);
    });
    if (this.actionColumnSettings?.defaultComponent) {
      columns.push(
        this.getGenericColumnAction(
          resourceName,
          this.actionColumnSettings.defaultComponent
        )
      );
    }
    this.additionalSettings.forEach((additionalSetting) => {
      columns.push(additionalSetting.colDef);
    });
    return columns;
  }
  private getGenericColumnAction<T>(
    resourceName: string,
    cellComponent: Component
  ): ColDef<T> {
    return {
      headerName: "Actions",
      type: "actionColumn",
      colId: "defaultActions",
      cellRenderer: cellComponent,
      cellRendererParams: {
        resourceName,
      },
      width: 107,
    };
  }
  private getGenericColumnString<T>(
    metaData: TResourceColumnMetaData
  ): ColDef<T> {
    return {
      headerName: metaData.label_name,
      colId: metaData.field_name,
      valueGetter: (params) => {
        if (!params.data) return "";
        return params.data[metaData.raw_field_name as keyof T];
      },
      type: "keywordColumn",
      filter: "agTextColumnFilter",
    };
  }
  private getGenericColumnNumber<T>(
    metaData: TResourceColumnMetaData
  ): ColDef<T> {
    return {
      headerName: metaData.label_name,
      colId: metaData.field_name,
      valueGetter: (params) => {
        if (!params.data) return "";
        return params.data[metaData.raw_field_name as keyof T];
      },
      type: "numberColumn",
      filter: "agNumberColumnFilter",
    };
  }
  private getGenericColumnDate<T>(
    metaData: TResourceColumnMetaData
  ): ColDef<T> {
    return {
      headerName: metaData.label_name,
      colId: metaData.field_name,
      type: "dateColumn",
      filter: "agDateColumnFilter",
      valueGetter: (params) => {
        if (!params.data) return "";
        return this.globalColumnSettings.columnDateFormater!(
          params.data[metaData.raw_field_name as keyof T] as string
        );
      },
      width: 150,
    };
  }
  private getGenericColumnBoolean<T>(
    metaData: TResourceColumnMetaData
  ): ColDef<T> {
    return {
      headerName: metaData.label_name,
      colId: metaData.field_name,
      type: "booleanColumn",
      valueGetter: (params) => {
        if (
          !params.data ||
          params.data[metaData.raw_field_name as keyof T] === undefined ||
          params.data[metaData.raw_field_name as keyof T] === null
        )
          return "";
        return params.data[metaData.raw_field_name as keyof T] ? "Oui" : "Non";
      },
      width: 150,
    };
  }
  private getGenericColumnObject<T>(
    metaData: TResourceColumnMetaData
  ): ColDef<T> {
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
  private getGenericColumnValueGetterRelation<T>(
    column: ColDef<T>
  ): ValueGetterFunc<T> {
    if (!column.colId) return () => null;
    const baseValueGetter = column.valueGetter;
    const colIdMacro = column.colId.split("::").at(-1);
    const colIdRelation = column.colId.split(".").at(0) as keyof T;
    if (
      !colIdRelation ||
      !baseValueGetter ||
      typeof baseValueGetter !== "function"
    )
      return () => null;
    if (colIdMacro === "has_many" || colIdMacro === "has_and_belongs_to_many") {
      return (params) => {
        if (!params.data || !params.data[colIdRelation]) return "";
        return (params.data[colIdRelation] as Record<string, unknown>[]).map(
          (relation) => {
            return baseValueGetter({ ...params, data: relation as T });
          }
        );
      };
    }
    if (colIdMacro === "belongs_to" || colIdMacro === "has_one") {
      return (params) => {
        if (!params.data || !params.data[colIdRelation]) return "";
        return baseValueGetter({
          ...params,
          data: params.data[colIdRelation] as T,
        });
      };
    }
    return () => null;
  }
}
