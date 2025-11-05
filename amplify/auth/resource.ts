import { defineAuth } from '@aws-amplify/backend';
import { addUserToViewer } from '../functions/addUserToViewer/resource';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ['Admin','Allies','Viewer'],
  triggers: {
    postConfirmation: addUserToViewer
  }
});
