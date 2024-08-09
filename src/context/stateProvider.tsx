'use client'

import { invoke } from "@tauri-apps/api/tauri";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AppState {
    preferences: Preferences;
    log_data: Session[];
}

export interface Preferences {
    license: License;
}

export interface License {
    activated: boolean;
    user_email: string;
    license_key: string;
}

export interface Session {
    date: string;
    target: string;
    sub_length: number;
    total_subs: number;
    integrated_subs: number;
    filter: string;
    gain: number;
    offset: number;
    camera_temp: number;
    outside_temp: number;
    average_seeing: number;
    average_cloud_cover: number;
    telescope: string;
    flattener: string;
    mount: string;
    camera: string;
    notes: string;
};

const defaultAppState: AppState = {
    preferences: {
        license: {
            activated: false,
            user_email: "",
            license_key: ""
        }
    },
    log_data: []
}

const AppStateContext = createContext<AppState>(defaultAppState);

export default function StateProvider({ children }: { children: ReactNode }) {
    const [appState, setAppState] = useState<AppState>(defaultAppState);

    useEffect(() => {
        async function fetchData() {
            try {
                const responseString = await invoke<string>('get_frontend_data');
                const responseData: AppState = JSON.parse(responseString);

                setAppState(responseData);
            } catch (error) {
                console.error('Error fetching or parsing data:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        console.log(appState.log_data);
    }, [appState]);

    return (
        <AppStateContext.Provider value={appState}>{children}</AppStateContext.Provider>
    );
}

export function useAppState() {
    return useContext(AppStateContext);
}
