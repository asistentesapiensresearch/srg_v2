import {
    CognitoIdentityProviderClient,
    AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient();

export const handler = async (event: any) => {
    // Cuando se llama desde una mutación de GraphQL, los argumentos vienen aquí
    const { username, groupName } = event.arguments;
    const userPoolId = process.env.AMPLIFY_AUTH_USERPOOL_ID;

    if (!userPoolId) {
        throw new Error("Missing AMPLIFY_AUTH_USERPOOL_ID env var");
    }

    try {
        const command = new AdminAddUserToGroupCommand({
            UserPoolId: userPoolId,
            Username: username,
            GroupName: groupName,
        });

        await client.send(command);
        console.log(`Success: User ${username} added to group ${groupName}`);
        return true;
    } catch (error) {
        console.error('Error adding user to group:', error);
        throw error;
    }
};