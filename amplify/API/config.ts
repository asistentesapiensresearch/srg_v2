import { Stack } from "aws-cdk-lib";
import { AuthorizationType, Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

interface Policy {
    actions: string[];
    resources: string[];
}

interface Lambda {
    path: string;
    lambda: any;
    policies: Policy[];
}

export function configApi(backend: any) {

    // Crear un nuevo stack para la API
    const apiStack = backend.createStack("api-auth-stack");

    // Crear la API REST
    const authRestApi = new RestApi(apiStack, "RestApi", {
        restApiName: "srgRestApi",
        deploy: true,
        defaultCorsPreflightOptions: {
            allowOrigins: Cors.ALL_METHODS,
            allowMethods: Cors.ALL_METHODS,
            allowHeaders: Cors.DEFAULT_HEADERS,
            allowCredentials: true
        },
    });

    const lambdas: Lambda[] = [
        {
            path: 'addUserToViewer',
            lambda: backend.addUserToViewer,
            policies: [
                {
                    actions: ['cognito-idp:AdminAddUserToGroup'],
                    resources: ['*'],
                }
            ]
        }
    ];

    lambdas.forEach((itemLambda) => {
        // Verificar si la Lambda está definida
        if (!itemLambda.lambda || !itemLambda.lambda.resources?.lambda) {
            throw new Error(`Lambda (${itemLambda.path}) no está definida. Asegúrate de haber creado una función Lambda.`);
        }

        // Integración con la Lambda
        const lambdaIntegration = new LambdaIntegration(
            itemLambda.lambda.resources.lambda
        );

        itemLambda.policies.forEach((policy) => {
            itemLambda.lambda.resources.lambda.addToRolePolicy(new PolicyStatement({
                actions: policy.actions,
                resources: policy.resources
            }))
        })

        // Crear recurso "terms" en la API sin autenticación
        const itemsPath = authRestApi.root.addResource(itemLambda.path, {
            defaultMethodOptions: {
                authorizationType: AuthorizationType.NONE, // Permitir acceso sin autenticación
            },
        });

        // Métodos disponibles
        itemsPath.addMethod("GET", lambdaIntegration);
        itemsPath.addMethod("POST", lambdaIntegration);
        itemsPath.addMethod("DELETE", lambdaIntegration);
        itemsPath.addMethod("PUT", lambdaIntegration);

        // Agregar un proxy para manejar rutas dinámicas
        itemsPath.addProxy({
            anyMethod: true,
            defaultIntegration: lambdaIntegration,
        });
    });

    // Agregar información de salida
    backend.addOutput({
        custom: {
            API: {
                [authRestApi.restApiName]: {
                    endpoint: authRestApi.url,
                    region: Stack.of(authRestApi).region,
                    apiName: authRestApi.restApiName,
                },
            },
        },
    });

}
