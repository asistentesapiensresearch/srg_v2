import {
    CognitoIdentityProviderClient,
    ListUsersCommand
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient();

export const handler = async (event: any) => {
    const userPoolId = process.env.AMPLIFY_AUTH_USERPOOL_ID;

    try {
        const command = new ListUsersCommand({
            UserPoolId: userPoolId,
            Limit: 60
        });

        const response = await client.send(command);

        const users = response.Users?.map(user => {
            const emailAttr = user.Attributes?.find(a => a.Name === 'email');
            const nameAttr = user.Attributes?.find(a => a.Name === 'name');
            return {
                username: user.Username,
                email: emailAttr ? emailAttr.Value : '',
                name: nameAttr ? nameAttr.Value : 'Sin nombre',
                status: user.UserStatus,
                enabled: user.Enabled
            };
        }) || [];

        return users;
    } catch (error) {
        console.error(error);
        return JSON.stringify([]);
    }
};