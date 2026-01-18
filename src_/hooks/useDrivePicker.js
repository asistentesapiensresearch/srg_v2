import { useState, useCallback } from "react";

export function useDrivePicker() {
    const [token, setToken] = useState(null);

    const loadPickerApi = () => {
        return new Promise((resolve) => {
            // gapi viene del script api.js
            window.gapi.load("picker", resolve);
        });
    };

    const signIn = useCallback(() => {
        return new Promise((resolve, reject) => {
            google.accounts.oauth2
                .initTokenClient({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    scope: "https://www.googleapis.com/auth/drive.readonly",
                    callback: (response) => {
                        if (response.access_token) {
                            setToken(response.access_token);
                            resolve(response.access_token);
                        } else {
                            reject("No access_token");
                        }
                    },
                })
                .requestAccessToken();
        });
    }, []);

    const openPicker = useCallback(async () => {
        // 1) Asegurar OAuth
        let accessToken = token;
        if (!accessToken) accessToken = await signIn();

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
            );

        // 4) Crear picker SIN API KEY y SIN APP ID
        return new Promise((resolve) => {
            const picker = new google.picker.PickerBuilder()
                .setOAuthToken(accessToken)
                .addView(view)
                .setCallback((data) => {
                    if (data.action === google.picker.Action.PICKED) {
                        const file = data.docs[0];
                        resolve({
                            id: file.id,
                            name: file.name,
                            url: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
                        });
                    }
                })
                .build();

            picker.setVisible(true);
        });

    }, [token, signIn]);

    return { openPicker };
}