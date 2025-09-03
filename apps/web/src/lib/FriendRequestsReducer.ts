import { Reducer } from "react";

export type FriendRequestsAction =
    | { type: "ADD_REQUEST"; payload: FriendRequest }
    | { type: "REMOVE_REQUEST"; payload: { requestId: string } }
    | { type: "SET_REQUESTS"; payload: FriendRequest[] }

export const friendRequestsReducer: Reducer<FriendRequest[], FriendRequestsAction> = (state, action) => {
    switch (action.type) {
        case "ADD_REQUEST":
            return [...state, action.payload];
        case "REMOVE_REQUEST":
            return state.filter((request) => request.id !== action.payload.requestId);
        case "SET_REQUESTS":
            return action.payload;
        default:
            return state;
    }
};