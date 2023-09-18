import { SET_ANSWER, SET_COUNT, SET_GO_TO_CHAT, SET_INPUT, SET_IS_LAST_PAGE, SET_REGION, SET_SERVICES, SET_SUBREGION, SET_SUMMARY, SET_SUPPORT_LIST, SET_USER } from "../action/action";

// export type TextState = {
//     answer: string;
//     supportList: string[];
// };

export const SET_API = "SET_API"

const initState = {
    answer: "",
    supportList: [],
    isLastPage: false,
    input: "",
    count: 0,
    services: [],
    region: "",
    subRegion: "",
    user: "",
    summary: "",
    goToChat: false
}

export const reducer = (state = initState, action) => {
    switch (action.type) {
        case SET_ANSWER:
            return {
                ...state,
                answer: action.data
            }
        case SET_SUPPORT_LIST:
            return {
                ...state,
                supportList: action.data
            }
        case SET_IS_LAST_PAGE:
            return {
                ...state,
                isLastPage: action.data
            }
        case SET_INPUT:
            return {
                ...state,
                input: action.data
            }
        case SET_COUNT:
            return {
                ...state,
                count: action.data
            }
        case SET_SERVICES:
            return {
                ...state,
                services: action.data
            }
        case SET_REGION:
            return {
                ...state,
                region: action.data
            }
        case SET_SUBREGION:
            return {
                ...state,
                subRegion: action.data
            }
        case SET_USER:
            return {
                ...state,
                user: action.data
            }
        case SET_SUMMARY:
            return {
                ...state,
                summary: action.data
            }
        case SET_GO_TO_CHAT:
            return {
                ...state,
                goToChat: action.data
            }
        default:
            return state;
    }
}