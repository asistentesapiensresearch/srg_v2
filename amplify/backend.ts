import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
// Asegúrate de importar la nueva función (si usas un archivo index en functions, expórtala ahí primero)
import { addUserToGroup, listUsersFunction } from './functions';
import { manageUserGroup } from './functions/manageUserGroup/resource'; // Importación directa

const backend = defineBackend({
  auth,
  data,
  storage,
  addUserToGroup,
  listUsersFunction,
  manageUserGroup, // 1. Agregamos la función al backend
});

// --- Permisos para Listar Usuarios (Ya lo tenías) ---
const authResource = backend.auth.resources.userPool;
authResource.grant(
  backend.listUsersFunction.resources.lambda,
  'cognito-idp:ListUsers'
);
(backend.listUsersFunction.resources.lambda as any).addEnvironment(
  'AMPLIFY_AUTH_USERPOOL_ID',
  backend.auth.resources.userPool.userPoolId
);

// --- 🔥 2. PERMISOS PARA GESTIONAR GRUPOS (NUEVO) ---

// Permitir que la lambda ejecute AdminAddUserToGroup
backend.auth.resources.userPool.grant(
  backend.manageUserGroup.resources.lambda,
  'cognito-idp:AdminAddUserToGroup'
);

// Inyectar el ID del UserPool como variable de entorno
(backend.manageUserGroup.resources.lambda as any).addEnvironment(
  'AMPLIFY_AUTH_USERPOOL_ID',
  backend.auth.resources.userPool.userPoolId
);