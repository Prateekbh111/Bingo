export type FriendsAction =
    | { type: "ADD_FRIEND"; payload: Friend }
    | { type: "SET_FRIENDS"; payload: Friend[] }

export function friendsReducer(
    state: Friend[],
    action: FriendsAction
): Friend[] {
    switch (action.type) {
        case "ADD_FRIEND":
            return [...state, action.payload];
        case "SET_FRIENDS":
            return action.payload;
        default:
            return state;
    }
}
