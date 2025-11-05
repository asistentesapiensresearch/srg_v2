import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({});

export const handler = async (event: any) => {
  const userPoolId = event?.userPoolId;
  const username = event?.userName;
  const groupName = 'Viewer';

  if (!userPoolId || !username) {
    console.warn('Missing userPoolId or userName in event');
    return event;
  }

  try {
    await client.send(
      new AdminAddUserToGroupCommand({
        GroupName: groupName,
        UserPoolId: userPoolId,
        Username: username,
      })
    );
    console.log(`User ${username} added to group ${groupName}`);
  } catch (error) {
    console.error('Failed to add user to group', error as Error);
  }

  return event;
};