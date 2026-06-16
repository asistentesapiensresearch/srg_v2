import { useState, useCallback } from "react";

// Instancia global/de módulo para el cliente de token de Google
let tokenResolve = null;
let tokenReject = null;

const initClient = (resolve, reject) => {
    tokenResolve = resolve;
    tokenReject = reject;
    
    if (window.tokenClient) return window.tokenClient;
    
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
        console.error("Google Accounts OAuth2 API not loaded");
        return null;
    }
    
    window.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly",
        callback: (response) => {
            if (response.access_token) {
                localStorage.setItem("google_oauth_token", response.access_token);
                const expiresAt = Date.now() + (response.expires_in || 3600) * 1000;
                localStorage.setItem("google_oauth_expires_at", expiresAt.toString());
                if (tokenResolve) tokenResolve(response.access_token);
            } else {
                if (tokenReject) tokenReject(response.error || "Failed to get access token");
            }
        }
    });
    return window.tokenClient;
};

const isTokenValid = () => {
    const token = localStorage.getItem("google_oauth_token");
    const expiresAtStr = localStorage.getItem("google_oauth_expires_at");
    if (!token || !expiresAtStr) return false;
    const expiresAt = parseInt(expiresAtStr, 10);
    // Válido si expira en más de 60 segundos
    return expiresAt > Date.now() + 60 * 1000;
};

export function useDrivePicker() {
    const [token, setToken] = useState(() => localStorage.getItem("google_oauth_token"));

    const loadPickerApi = () => {
        return new Promise((resolve) => {
            window.gapi.load("picker", resolve);
        });
    };

    const getOrRequestToken = useCallback(async (forcePrompt = false) => {
        if (!forcePrompt && isTokenValid()) {
            const stored = localStorage.getItem("google_oauth_token");
            setToken(stored);
            return stored;
        }

        // Intentar renovación silenciosa primero
        if (!forcePrompt) {
            try {
                const renewed = await new Promise((resolve, reject) => {
                    const client = initClient(resolve, reject);
                    if (!client) return reject("Client not loaded");
                    client.requestAccessToken({ prompt: '' });
                });
                setToken(renewed);
                return renewed;
            } catch (err) {
                console.warn("Silent token refresh failed, prompting user...", err);
            }
        }

        // Flujo de consentimiento interactivo (popup)
        const interactive = await new Promise((resolve, reject) => {
            const client = initClient(resolve, reject);
            if (!client) return reject("Client not loaded");
            client.requestAccessToken({ prompt: 'consent' });
        });
        setToken(interactive);
        return interactive;
    }, []);

    const openPicker = useCallback(async () => {
        // 1) Asegurar OAuth
        let accessToken;
        try {
            accessToken = await getOrRequestToken(false);
        } catch (err) {
            accessToken = await getOrRequestToken(true);
        }

        // 2) Asegurar carga de google.picker
        await loadPickerApi();

        if (!google.picker) {
            console.error("Picker API not loaded");
            return;
        }

        // 3) Construir vista
        const view = new google.picker.DocsView(google.picker.ViewId.DOCS)
            .setMimeTypes(
                [
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.google-apps.spreadsheet",
                ].join(",")
            )
            .setIncludeFolders(true)
            .setEnableDrives(true);

        // 4) Crear picker
        return new Promise((resolve) => {
            const picker = new google.picker.PickerBuilder()
                .setOAuthToken(accessToken)
                .addView(view)
                .enableFeature(google.picker.Feature.SUPPORT_DRIVES)
                .setCallback((data) => {
                    if (data.action === google.picker.Action.PICKED) {
                        const file = data.docs[0];
                        resolve({
                            id: file.id,
                            name: file.name,
                            url: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
                            token: accessToken
                        });
                    }
                })
                .build();

            picker.setVisible(true);
        });

    }, [getOrRequestToken]);

    return { 
        openPicker, 
        token, 
        renewToken: () => getOrRequestToken(true), 
        getValidToken: () => getOrRequestToken(false) 
    };
}