import { SET_VIEW_MORE, SET_ANSWER, SET_COUNT, SET_GO_TO_CHAT, SET_INPUT, SET_IS_LAST_PAGE, SET_REGION, SET_SERVICES, SET_SUBREGION, SET_SUMMARY, SET_SUPPORT_LIST, SET_USER, SET_MIN_TWENTY, SET_VOICE_COUNT, SET_FIRST_JIMI, SET_JIMI, SET_SIDOCODEARRAY, SET_USERARRAY } from "../action/action";

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
    goToChat: false,
    viewMore: false,
    minTwenty: '',
    voiceCount: 0,
    firstJimi: "",
    jimi: [],
    sidoCodeArray: [],
    userArray: []
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
        case SET_VIEW_MORE:
            return {
                ...state,
                viewMore: action.data
            }
        case SET_MIN_TWENTY:
            return {
                ...state,
                minTwenty: action.data
            }
        case SET_VOICE_COUNT:
            return {
                ...state,
                voiceCount: action.data
            }
        case SET_FIRST_JIMI:
            return {
                ...state,
                firstJimi: action.data
            }
        case SET_JIMI:
            return {
                ...state,
                jimi: action.data
            }
        case SET_SIDOCODEARRAY:
            return {
                ...state,
                sidoCodeArray: action.data
            }
        case SET_USERARRAY:
            return {
                ...state,
                userArray: action.data
            }
        default:
            return state;
    }
}