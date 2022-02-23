import { AVAILABLE_SHAPES } from "../../shapes/availableShapes";
import { PAGES_ACTION_TYPES } from "./pages.actionTypes";
import { SHAPE_TYPES } from "../../utils/constant";
import { STYLE } from "../../shapes/style";
import { AVAILABLE_FILTERS, FILTER_TYPES } from "../../filters/availableFilters";

export interface CONTEXT_MENU_INTERFACE { show: boolean; x: number; y: number; };
export type ACTIVE_SHAPE_INFO = Array<{ index: number, id: string }>;
export type SHAPE_COLLECTION = {
    id: string;
    activeShapes: ACTIVE_SHAPE_INFO;
    shapes: Array<AVAILABLE_SHAPES>;
    filters: {
        [key: string]: AVAILABLE_FILTERS
    };
};

export interface PAGES {
    activePageIndex: number;
    activeTool: SHAPE_TYPES;
    hoveredShapeId: string | null;
    contextMenu: CONTEXT_MENU_INTERFACE;
    clipboard: Array<AVAILABLE_SHAPES>;
    pages: Array<SHAPE_COLLECTION>;
    colors: string[],
    gradients: string[],
    images: string[]
};

interface ACTION<Type, Payload> {
    type: Type;
    payload: Payload;
}


// set active page
export type SET_ACTIVE_PAGE_PAYLOAD = number;
export type SET_ACTIVE_PAGE_ACTION = ACTION<PAGES_ACTION_TYPES.SET_ACTIVE_PAGE, SET_ACTIVE_PAGE_PAYLOAD>;

// add shape
export interface ADD_SHAPE_PAYLOAD { shape: SHAPE_TYPES, x: number, y: number, pointsArray?: Array<[number, number]> };
export type ADD_SHAPE_ACTION = ACTION<PAGES_ACTION_TYPES.ADD_SHAPE, AVAILABLE_SHAPES>;

// moving the shape
export interface SET_ACTIVE_SHAPE_COORDINATES_PAYLOAD { x: number, y: number };
export type SET_ACTIVE_SHAPE_COORDINATES_ACTION = ACTION<PAGES_ACTION_TYPES.SET_ACTIVE_SHAPE_COORDINATES, SET_ACTIVE_SHAPE_COORDINATES_PAYLOAD>;

// setting active tools
export type SET_ACTIVE_TOOL_PAYLOAD = SHAPE_TYPES;
export type SET_ACTIVE_TOOL_ACTION = ACTION<PAGES_ACTION_TYPES.SET_ACTIVE_TOOL, SET_ACTIVE_TOOL_PAYLOAD>;

// set hoveredSHAPE
export type SET_HOVERED_SHAPE_PAYLOAD = string | null;
export type SET_HOVERED_SHAPE_ACTION = ACTION<PAGES_ACTION_TYPES.SET_HOVERED_SHAPE, SET_HOVERED_SHAPE_PAYLOAD>;

//e setting active shape
export type SET_ACTIVE_SHAPE_PAYLOAD = Array<{ id: string, index: number }>;
export type SET_ACTIVE_SHAPE_ACTION = ACTION<PAGES_ACTION_TYPES.SET_ACTIVE_SHAPE, SET_ACTIVE_SHAPE_PAYLOAD>;

// toggeling context menu
export type TOGGLE_CONTEXT_MENU_PAYLOAD = { x: number, y: number };
export type TOGGLE_CONTEXT_MENU_ACTION = ACTION<PAGES_ACTION_TYPES.TOGGLE_CONTEXT_MENU, TOGGLE_CONTEXT_MENU_PAYLOAD | undefined>;

// cut from page and save to clipboard
export type CUT_SELECTED_SHAPES_ACTION = ACTION<PAGES_ACTION_TYPES.CUT_SELECTED_SHAPES, undefined>;

// copy from page and save to clipboard
export type COPY_SELECTED_SHAPES_ACTION = ACTION<PAGES_ACTION_TYPES.COPY_SELECTED_SHAPES, undefined>;

// paste from clipboard to page
export type PASTE_SELECTED_SHAPES_ACTION = ACTION<PAGES_ACTION_TYPES.PASTE_SELECTED_SHAPES, undefined>;

// remove selected shapes
export type REMOVE_SELECTED_SHAPES_ACTION = ACTION<PAGES_ACTION_TYPES.REMOVE_SELECTED_SHAPES, undefined>;

// save selected shapes as group
export type SAVE_SELECTED_SHAPES_AS_GROUP_ACTION = ACTION<PAGES_ACTION_TYPES.SAVE_SELECTED_SHAPES_AS_GROUP, undefined>;

// rename shape
export type RENAME_SHAPE_PAYLOAD = { name: string; index: number, isGroup: boolean, childIndex?: number };
export type RENAME_SHAPE_ACTION = ACTION<PAGES_ACTION_TYPES.RENAME_SHAPE, RENAME_SHAPE_PAYLOAD>;

//add svg filters
export type ADD_SVG_FILTERS_PAYLOAD = AVAILABLE_FILTERS;
export type ADD_SVG_FILTERS_ACTION = ACTION<PAGES_ACTION_TYPES.ADD_SVG_FILTERS, ADD_SVG_FILTERS_PAYLOAD>;

//edit svg filter
export type EDIT_SVG_FILTER_Payload = { id: string, newFilter: AVAILABLE_FILTERS };
export type EDIT_SVG_FILTER_ACTION = ACTION<PAGES_ACTION_TYPES.EDIT_SVG_FILTER, EDIT_SVG_FILTER_Payload>;

//remove svg filter
export type REMOVE_SVG_FILTER_PAYLOAD = { filterId: string, filterType: FILTER_TYPES, shapeIndex: number };
export type REMOVE_SVG_FILTER_ACTION = ACTION<PAGES_ACTION_TYPES.REMOVE_SVG_FILTER, REMOVE_SVG_FILTER_PAYLOAD>;

// format active shapes
// might need to extend payload type based on properties of shapes
export type FORMAT_ACTIVE_SHAPE_PAYLOAD = {
    index: number,
    style?: Partial<STYLE>,
    properties?: Partial<{
        x?: number,
        y?: number,
        radius?: number, base64Url?: string | ArrayBuffer | null,
        text?: string,
        name?: string,
        height?: number,
        width?: number,
        rx?: number,
        ry?: number,
        points?: [number, number][],
        radiusX?: number,
        radiusY?: number,
        fontSize?: number,
        fontWeight?: number,
        fontStyle?: string,
        fontFamily?: string,
        genericFontFamily?: string,
        style?: any
    }>
};
export type FORMAT_ACTIVE_SHAPE_ACTION = ACTION<PAGES_ACTION_TYPES.FORMAT_ACTIVE_SHAPE, FORMAT_ACTIVE_SHAPE_PAYLOAD>;

export type ADD_COLOR_IN_PALETTE_PAYLOAD = string;
export type ADD_COLOR_IN_PALETTE_ACTION = ACTION<PAGES_ACTION_TYPES.ADD_COLOR_IN_PALETTE, ADD_COLOR_IN_PALETTE_PAYLOAD>;

export type EDIT_PALETTE_COLOR_AT_INDEX_PAYLOAD = { index: number, color: string };
export type EDIT_PALETTE_COLOR_AT_INDEX_ACTION = ACTION<PAGES_ACTION_TYPES.EDIT_PALETTE_COLOR_AT_INDEX, EDIT_PALETTE_COLOR_AT_INDEX_PAYLOAD>;

export type REMOVE_PALETTE_COLOR_AT_INDEX_PAYlOAD = number;
export type REMOVE_PALETTE_COLOR_AT_INDEX_ACTION = ACTION<PAGES_ACTION_TYPES.REMOVE_PALETTE_COLOR_AT_INDEX, REMOVE_PALETTE_COLOR_AT_INDEX_PAYlOAD>


export type PAGE_ACTION = SET_ACTIVE_PAGE_ACTION
    | ADD_SHAPE_ACTION
    | SET_ACTIVE_SHAPE_COORDINATES_ACTION
    | SET_ACTIVE_TOOL_ACTION
    | SET_HOVERED_SHAPE_ACTION
    | SET_ACTIVE_SHAPE_ACTION
    | TOGGLE_CONTEXT_MENU_ACTION
    | CUT_SELECTED_SHAPES_ACTION
    | PASTE_SELECTED_SHAPES_ACTION
    | COPY_SELECTED_SHAPES_ACTION
    | REMOVE_SELECTED_SHAPES_ACTION
    | SAVE_SELECTED_SHAPES_AS_GROUP_ACTION
    | RENAME_SHAPE_ACTION
    | FORMAT_ACTIVE_SHAPE_ACTION
    | ADD_SVG_FILTERS_ACTION
    | EDIT_SVG_FILTER_ACTION
    | REMOVE_SVG_FILTER_ACTION
    | ADD_COLOR_IN_PALETTE_ACTION
    | EDIT_PALETTE_COLOR_AT_INDEX_ACTION
    | REMOVE_PALETTE_COLOR_AT_INDEX_ACTION;


