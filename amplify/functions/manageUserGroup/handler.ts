import {
    CognitoIdentityProviderClient,
    AdminAddUserToGroupCommand,
    AdminRemoveUserFromGroupCommand,
    AdminDisableUserCommand,
    AdminEnableUserCommand
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient();

export const handler = async (event: any) => {
    const { username, groupName, action } = event.arguments;
    const userPoolId = process.env.AMPLIFY_AUTH_USERPOOL_ID;

    if (!userPoolId) throw new Error("Missing AMPLIFY_AUTH_USERPOOL_ID");

    try {
        switch (action) {
            case 'add':
                await client.send(new AdminAddUserToGroupCommand({
                    UserPoolId: userPoolId,
                    Username: username,
                    GroupName: groupName,
                }));
                break;

            case 'remove':
                await client.send(new AdminRemoveUserFromGroupCommand({
                    UserPoolId: userPoolId,
                    Username: username,
                    GroupName: groupName,
                }));
                break;

            case 'disable':
                await client.send(new AdminDisableUserCommand({
                    UserPoolId: userPoolId,
                    Username: username
                }));
                break;

            case 'enable':
                await client.send(new AdminEnableUserCommand({
                    UserPoolId: userPoolId,
                    Username: username
                }));
                break;

            default:
                throw new Error(`Acción desconocida: ${action}`);
        }

        return true;

    } catch (error) {
        console.error('Error managing user:', error);
        throw error;
    }
};