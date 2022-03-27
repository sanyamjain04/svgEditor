import { PAGE_ACTION } from "../actions/pages/pages.interface";
import { PAGES_ACTION_TYPES } from "../actions/pages/pages.actionTypes";
import generateId from "../utils/idGenerator";
import { PAGES } from "../actions/pages/pages.interface";
import { Reducer } from "redux";
import { multiPointShpes, SHAPE_TYPES } from "../utils/constant";
import { AVAILABLE_SHAPES } from "../shapes/availableShapes";
import { getGroupDefaultProps, GROUP_SHAPE } from "../shapes/group";
import { POLYGON_SHAPE } from "../shapes/polygon";
import { cloneDeep } from 'lodash';

const id = generateId();

const initialState: PAGES = {
    activePageIndex: 0,
    activeTool: SHAPE_TYPES.PAN,
    hoveredShapeId: null,
    clipboard: [],
    contextMenu: { show: false, x: 0, y: 0, clipboard: { x: 0, y: 0 } },
    pages: [
        { id: id, activeShapes: [], shapes: {}, filters: {}, renderTree: [] }
    ],
    colors: {},
    gradients: {},
    images: {}
}

const pagesReducer: Reducer<PAGES, PAGE_ACTION> = function (state: PAGES = initialState, action: PAGE_ACTION): PAGES {
    switch (action.type) {

        case PAGES_ACTION_TYPES.SET_ACTIVE_PAGE: {
            return { ...state, activePageIndex: action.payload };
        }

        case PAGES_ACTION_TYPES.ADD_SHAPE: {
            const currentPage = state.pages[state.activePageIndex];
            if (currentPage) {
                currentPage.shapes = { ...currentPage.shapes, [action.payload.id]: action.payload };
                currentPage.activeShapes = [action.payload.id];
                currentPage.renderTree = [...currentPage.renderTree, { id: action.payload.id }];
                return { ...state, pages: [...state.pages] }
            }
            return state;
        }

        case PAGES_ACTION_TYPES.TRANSLATE_ACTIVE_SHAPE: {
            const currentPage = state.pages[state.activePageIndex];
            if (currentPage) {
                currentPage.activeShapes.forEach((shapeId) => {
                    const shape = currentPage.shapes[shapeId];
                    shape.style.translate[0] += action.payload.x;
                    shape.style.translate[1] += action.payload.y;
                    currentPage.shapes[shapeId] = { ...shape };
                });
                return { ...state };
            }
            return state;
        }

        case PAGES_ACTION_TYPES.SET_ACTIVE_TOOL: {
            return { ...state, activeTool: action.payload };
        }

        case PAGES_ACTION_TYPES.SET_HOVERED_SHAPE: {
            return { ...state, hoveredShapeId: action.payload };
        }

        case PAGES_ACTION_TYPES.SET_ACTIVE_SHAPE: {
            const currentPage = state.pages[state.activePageIndex];
            if (currentPage) {
                currentPage.activeShapes = action.payload;
                return { ...state, pages: [...state.pages] };
            }
            return state;
        }

        case PAGES_ACTION_TYPES.TOGGLE_CONTEXT_MENU: {
            state.contextMenu = action.payload
                ? { show: true, clipboard: { ...state.contextMenu.clipboard }, ...action.payload }
                : { show: false, x: 0, y: 0, clipboard: { ...state.contextMenu.clipboard } }
            return { ...state };
        }

        case PAGES_ACTION_TYPES.CUT_SELECTED_SHAPES: {
            const currentPage = state.pages[state.activePageIndex];
            // shape is object with full shape description
            // activeShapes only contaibn id and index of activeShapes
            let shapes = currentPage.shapes;
            const activeShapes = currentPage.activeShapes;
            const clipboard: AVAILABLE_SHAPES[] = [];
            // adding active shapes to clipboard
            // keeping inactive shapes as it it
            activeShapes.forEach((shapeId) => {
                clipboard.push(shapes[shapeId]);
                delete shapes[shapeId];
            });
            currentPage.shapes = { ...shapes };
            state.contextMenu = { ...state.contextMenu, clipboard: { x: state.contextMenu.x, y: state.contextMenu.y } };
            // clearing activeshapes array
            currentPage.activeShapes = [];
            return { ...state, clipboard };
        }

        case PAGES_ACTION_TYPES.COPY_SELECTED_SHAPES: {
            const currentPage = state.pages[state.activePageIndex];
            // shape is object with full shape description
            // activeShapes only contaibn id and index of activeShapes
            const shapes = currentPage.shapes;
            const activeShapes = currentPage.activeShapes;
            const clipboard: AVAILABLE_SHAPES[] = [];
            // adding active shapes to clipboard
            // keeping inactive shapes as it it
            activeShapes.forEach(shapeId => {
                clipboard.push(shapes[shapeId]);
            })
            state.contextMenu = { ...state.contextMenu, clipboard: { x: state.contextMenu.x, y: state.contextMenu.y } };
            currentPage.shapes = { ...shapes };
            return { ...state, clipboard };
        }

        case PAGES_ACTION_TYPES.PASTE_SELECTED_SHAPES: {
            // the coodrinate where context menu is being displayed
            const { x, y } = state.contextMenu;
            let dx = x - state.contextMenu.clipboard.x;
            let dy = y - state.contextMenu.clipboard.y;
            // adding new coordinates and id's to shapes on clipboard
            const shapesToPaste: { [key: string]: AVAILABLE_SHAPES } = {};
            const currentPage = state.pages[state.activePageIndex];

            // deep cloning a group element
            const deepCloneGroup = function (shape: GROUP_SHAPE) {
                for (let i = 0; i < shape.children.length; i++) {
                    const childShapeId = shape.children[i];
                    const newChildShape = cloneDeep(currentPage.shapes[childShapeId]);
                    newChildShape.id = generateId();
                    shape.children[i] = newChildShape.id;
                    currentPage.shapes[newChildShape.id] = newChildShape;
                    if (newChildShape.type === SHAPE_TYPES.GROUP) {
                        deepCloneGroup(newChildShape as GROUP_SHAPE);
                    }
                }
                shape.children = [...shape.children];
            }

            state.clipboard.forEach(item => {
                let newShape: AVAILABLE_SHAPES;
                newShape = cloneDeep(item);
                newShape.id = generateId();
                newShape.style.translate = [item.style.translate[0] + dx, item.style.translate[1] + dy];
                shapesToPaste[newShape.id] = newShape;
                if (newShape.type === SHAPE_TYPES.GROUP) {
                    deepCloneGroup(newShape as GROUP_SHAPE)
                }
            });

            // concatining newly shapes with existing shapes
            currentPage.shapes = { ...currentPage.shapes, ...shapesToPaste };
            // setting these shapes as active shapes
            currentPage.activeShapes = Object.keys(shapesToPaste);
            return { ...state };
        }

        case PAGES_ACTION_TYPES.REMOVE_SELECTED_SHAPES: {
            const currentPage = state.pages[state.activePageIndex];
            // shape is object with full shape description
            // activeShapes only contaibn id and index of activeShapes
            let shapes = currentPage.shapes;
            const activeShapes = currentPage.activeShapes;
            activeShapes.forEach(shapeId => {
                delete shapes[shapeId]
            })
            currentPage.shapes = { ...shapes };
            // clearing active shapes array
            currentPage.activeShapes = [];
            return { ...state };
        }

        case PAGES_ACTION_TYPES.SAVE_SELECTED_SHAPES_AS_GROUP: {
            const currentPage = state.pages[state.activePageIndex];
            const groupChildren: string[] = [];
            // hiding active shapes from shapes array
            // adding active shapes to groupChildren array
            currentPage.activeShapes.forEach(shapeId => {
                const s = currentPage.shapes[shapeId];
                s.render = false;
                currentPage.shapes[shapeId] = { ...s };
                groupChildren.push(shapeId);
            })
            // creating new group shape
            const newGroup: GROUP_SHAPE = getGroupDefaultProps(groupChildren);
            // assigning new shapes array to currentpage.shapes
            currentPage.shapes = { ...currentPage.shapes, [newGroup.id]: newGroup };
            // // setting newly created group as active shape
            currentPage.activeShapes = [newGroup.id];
            return { ...state };
        }

        case PAGES_ACTION_TYPES.FORMAT_ACTIVE_SHAPE: {
            const { id, style = {}, properties = {} } = action.payload;
            const currentPage = state.pages[state.activePageIndex];
            // shape is object with full shape description
            // activeShapes only contaibn id and index of activeShapes
            let shape = currentPage.shapes[id];
            shape.style = { ...shape.style, ...style };

            currentPage.shapes[id] = { ...shape, ...properties as any };
            return { ...state };
        }

        case PAGES_ACTION_TYPES.ADD_SVG_FILTERS: {
            let currentPage = state.pages[state.activePageIndex];
            const filters = { ...currentPage.filters };
            filters[action.payload.id] = action.payload;
            currentPage.filters = filters;
            currentPage = { ...currentPage };
            return { ...state };
        }

        case PAGES_ACTION_TYPES.EDIT_SVG_FILTER: {
            let currentPage = state.pages[state.activePageIndex];
            const filters = { ...currentPage.filters };
            filters[action.payload.id] = action.payload.newFilter;
            currentPage.filters = filters;
            currentPage = { ...currentPage };
            return { ...state };
        }

        case PAGES_ACTION_TYPES.REMOVE_SVG_FILTER: {

            //deleting from filters array
            let currentPage = state.pages[state.activePageIndex];
            const filters = { ...currentPage.filters };
            delete filters[action.payload.filterId];
            currentPage.filters = filters;

            //deleting from shape
            const currentShape = currentPage.shapes[action.payload.shapeId];
            const svgFilters = currentShape.style.svgFilters;
            svgFilters[action.payload.filterType] = svgFilters[action.payload.filterType]?.filter(filterId => filterId !== action.payload.filterId);
            if (svgFilters[action.payload.filterType]?.length === 0) {
                delete svgFilters[action.payload.filterType]
            }

            currentShape.style.svgFilters = { ...svgFilters };
            currentPage = { ...currentPage };
            return { ...state };
        }

        case PAGES_ACTION_TYPES.ADD_COLOR_IN_PALETTE: {
            const colors = { ...state.colors };
            colors[generateId()] = action.payload;
            state.colors = colors;
            return { ...state };
        }

        case PAGES_ACTION_TYPES.EDIT_PALETTE_COLOR: {
            const colors = { ...state.colors };
            colors[action.payload.id] = action.payload.color;
            state.colors = colors;
            return { ...state };
        }

        case PAGES_ACTION_TYPES.REMOVE_PALETTE_COLOR: {
            const colors = { ...state.colors };
            delete colors[action.payload];
            state.colors = colors;
            return { ...state };
        }

        case PAGES_ACTION_TYPES.ADD_GRADIENT_IN_PALETTE: {
            const gradients = { ...state.gradients };
            gradients[generateId()] = action.payload;
            state.gradients = gradients;
            return { ...state };
        }

        case PAGES_ACTION_TYPES.EDIT_PALETTE_GRADIENT: {
            const gradients = { ...state.gradients };
            gradients[action.payload.id] = action.payload.newGradient;
            state.gradients = gradients;
            return { ...state };
        }

        case PAGES_ACTION_TYPES.REMOVE_PALETTE_GRADIENT: {
            const gradients = { ...state.gradients };
            delete gradients[action.payload];
            state.gradients = gradients;
            return { ...state };
        }

        case PAGES_ACTION_TYPES.ADD_PAGE: {
            if (action.payload?.index) {

            }
            else {
                state.pages.push({
                    id: generateId(),
                    activeShapes: [],
                    shapes: {},
                    filters: {},
                    renderTree: []
                });
                state.pages = [...state.pages];
                state.activePageIndex = state.pages.length - 1;
            }
            return { ...state };
        }

        case PAGES_ACTION_TYPES.REMOVE_PAGE: {
            if (action.payload) {

            }
            else {
                state.pages = state.pages.slice(0, -1);
                state.pages = [...state.pages];
                state.activePageIndex = state.pages.length - 1;
            }
            return { ...state };
        }

        default: return state;
    }
};

export default pagesReducer;



