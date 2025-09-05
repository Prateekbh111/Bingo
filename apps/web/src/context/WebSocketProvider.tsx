"use client";

import React, { createContext, useContext, useEffect, useRef, ReactNode, useReducer, useCallback } from 'react';
import { gameReducer, initialGameState } from "@/lib/GameReducer";
import { GameState, GameAction, Payload } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import {
    ACCEPT_GAME_INVITE,
    FRIEND_REQUEST_ACCEPTED,
    FRIEND_REQUEST_SENT,
    GAME_ENDED,
    GAME_INVITE,
    getWsUrl,
    GRID_FILLED,
    INIT_GAME,
    MOVE,
    PENDING_GAME,
    RECONNECT,
} from "@/lib/utils";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Session } from "next-auth";
import { FriendRequestsAction, friendRequestsReducer } from "@/lib/FriendRequestsReducer";
import { FriendsAction, friendsReducer } from '@/lib/FriendsReducer';

interface WebSocketContextType {
    socket: React.MutableRefObject<WebSocket | null>;
    isConnected: boolean;
    gameState: GameState;
    dispatch: React.Dispatch<GameAction>;
    resetGame: () => void;
    userCoins: number;
    fetchCoins: () => void;
    userFriendRequests: FriendRequest[];
    dispatchFriendRequests: React.Dispatch<FriendRequestsAction>;
    userFriends: Friend[];
    dispatchFriends: React.Dispatch<FriendsAction>;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

interface WebSocketProviderProps {
    children: ReactNode;
    sessionToken: string | undefined;
    session: Session;
    initialFriendRequests?: FriendRequest[];
    initialFriends?: Friend[];
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
    children,
    sessionToken,
    session,
    initialFriendRequests = [],
    initialFriends = []
}) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = React.useState(false);
    const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
    const [userFriendRequests, dispatchFriendRequests] = useReducer(friendRequestsReducer, []);
    const [userFriends, dispatchFriends] = useReducer(friendsReducer, []);
    const [userCoins, setUserCoins] = React.useState<number>(0);
    const { toast } = useToast();

    const resetGame = useCallback(() => {
        dispatch({ type: "RESET_GAME" });
        if (session?.user) {
            dispatch({
                type: "SET_PLAYER_DATA",
                payload: {
                    userData: {
                        data: {
                            id: session.user.id!,
                            image: session.user.image!,
                            name: session.user.name!,
                        },
                    },
                },
            });
        }
        fetchCoins();
    }, [session]);

    const fetchCoins = useCallback(async () => {
        try {
            const response = await axios.get<ApiResponse>("/api/balance");
            setUserCoins(response.data.payload!);
        } catch (error) {
            console.error("Failed to fetch coins:", error);
        }
    }, []);

    const handleMove = useCallback((payload: Payload) => {
        dispatch({ type: "MAKE_MOVE", payload: payload });
        dispatch({
            type: "SET_PLAYER_DATA",
            payload: {
                userData: {
                    timeConsumed:
                        gameState.userData.playerNumber === "player1"
                            ? payload.player1TimeConsumed!
                            : payload.player2TimeConsumed!,
                },
                opponentData: {
                    timeConsumed:
                        gameState.opponentData.playerNumber === "player1"
                            ? payload.player1TimeConsumed!
                            : payload.player2TimeConsumed!,
                    linesCompleted: payload.linesCompleted,
                },
            },
        });
    }, [gameState.userData.playerNumber, gameState.opponentData.playerNumber]);

    const handleGameInvite = useCallback((payload: Payload) => {
        toast({
            description: (
                <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                        <AvatarImage
                            src={payload.otherPlayer?.image}
                            alt={payload.otherPlayer?.name}
                        />
                        <AvatarFallback>{payload.otherPlayer?.name}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <p className="font-medium">Bingo Invite</p>
                        <p className="text-sm text-muted-foreground">
                            {payload.otherPlayer?.name} has invited you to play Bingo!
                        </p>
                    </div>
                </div>
            ),
            action: (
                <ToastAction
                    altText="Accept game invite"
                    onClick={() => {
                        dispatch({ type: "GAME_RESULT_RESET" });
                        resetGame();
                        socketRef.current!.send(
                            JSON.stringify({
                                type: ACCEPT_GAME_INVITE,
                                payload: { otherPlayer: payload.otherPlayer },
                            }),
                        );
                    }}
                >
                    <Check className="w-4 h-4 mr-1" />
                    Accept
                </ToastAction>
            ),
            duration: 5000,
        });
    }, [toast, resetGame]);

    // Use useRef to store the latest message handler to avoid reconnections
    const messageHandlerRef = useRef<(message: MessageEvent) => void>();

    // Update the ref whenever dependencies change
    messageHandlerRef.current = async (message: MessageEvent) => {
        const messageJson = JSON.parse(message.data);
        switch (messageJson.type) {
            case INIT_GAME:
                dispatch({
                    type: "INIT_GAME",
                    payload: messageJson.payload,
                });
                break;
            case GAME_INVITE:
                handleGameInvite(messageJson.payload);
                break;
            case GRID_FILLED:
                dispatch({
                    type: "SET_PLAYER_DATA",
                    payload: {
                        opponentData: { isCardFilled: true },
                    },
                });
                break;
            case MOVE:
                handleMove(messageJson.payload);
                break;
            case GAME_ENDED:
                if (gameState.gameResult?.result != "") return;
                dispatch({ type: "END_GAME", payload: messageJson.payload });
                fetchCoins();
                break;
            case RECONNECT:
                if (messageJson.payload.playerNumber === null) {
                    toast({
                        title: "Game Not Found",
                        description: "You are not connected to any game.",
                        duration: 1000,
                    });
                    dispatch({ type: "SET_PENDING_GAME", payload: null });
                    dispatch({ type: "START_SEARCH_NORMAL" });
                    socketRef.current?.send(JSON.stringify({ type: INIT_GAME }));
                } else {
                    toast({
                        title: "Reconnected",
                        description: "You are connected to previously uncompleted game.",
                        duration: 1000,
                    });
                    dispatch({ type: "RECONNECT_GAME", payload: messageJson.payload });
                }
                break;
            case PENDING_GAME:
                dispatch({
                    type: "SET_PENDING_GAME",
                    payload: messageJson.payload,
                });
                break;
            case FRIEND_REQUEST_SENT:
                dispatchFriendRequests({ type: "ADD_REQUEST", payload: messageJson.payload });
                break;
            case FRIEND_REQUEST_ACCEPTED:
                dispatchFriends({ type: "ADD_FRIEND", payload: messageJson.payload });
                break;
        }
    };

    // Stable wrapper function for WebSocket
    const handleSocketMessage = useCallback((message: MessageEvent) => {
        messageHandlerRef.current?.(message);
    }, []);

    useEffect(() => {
        if (!sessionToken) return;
        const newSocket = new WebSocket(`${getWsUrl()}/token=${sessionToken}`);

        newSocket.onopen = () => {
            setIsConnected(true);
        };

        newSocket.onmessage = handleSocketMessage;

        newSocket.onclose = () => {
            setIsConnected(false);
        };

        newSocket.onerror = () => {
            console.error("WebSocket connection error");
            setIsConnected(false);
        };

        socketRef.current = newSocket;

        return () => {
            if (newSocket.readyState === WebSocket.OPEN) {
                newSocket.close();
            }
        };
    }, [sessionToken]);

    // Initialize game on mount
    useEffect(() => {
        resetGame();
    }, [resetGame]);

    // Initialize friend requests and friends
    useEffect(() => {
        if (initialFriendRequests.length > 0) {
            dispatchFriendRequests({ type: "SET_REQUESTS", payload: initialFriendRequests });
        }
        if (initialFriends.length > 0) {
            dispatchFriends({ type: "SET_FRIENDS", payload: initialFriends });
        }
    }, [initialFriendRequests, initialFriends]);

    const value = {
        socket: socketRef,
        isConnected,
        gameState,
        dispatch,
        resetGame,
        userCoins,
        fetchCoins,
        userFriendRequests,
        dispatchFriendRequests,
        userFriends,
        dispatchFriends
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};
