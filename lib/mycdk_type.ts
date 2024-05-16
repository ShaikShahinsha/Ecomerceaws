import * as cdk from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';


export class MyCdkTypeStack extends cdk.Stack{
    constructor(scope:Construct, id: string, props?:cdk.StackProps){
        super(scope,id,props);


        const productTable = new Table(this,'product',{
            partitionKey:{
                name:'id',
                type:AttributeType.STRING
            },
            tableName:'product',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            billingMode:BillingMode.PAY_PER_REQUEST

        });

        const nodeJSFunctionProps:NodejsFunctionProps= {
            bundling: {
                externalModules:[
                    'aws-sdk'
                ]
            },

            environment: {
                PRIMARY_KEY: 'id',
                DYNAMODB_TABLE_NAME: productTable.tableName
            },
            runtime: Runtime.NODEJS_20_X

        }

        const productLamdbaFunction = new NodejsFunction(this,'productLambdafunction',{
            entry: join(__dirname,`../src/product/index.js`),
            ...nodeJSFunctionProps
        });


        productTable.grantReadWriteData(productLamdbaFunction);



        const apiLambdaGateway = new LambdaRestApi(this,'productApigateway',{
            restApiName:'product service',
            handler: productLamdbaFunction,
            proxy:false
        });

        const rootResourceApi = apiLambdaGateway.root.addResource('/product');
                rootResourceApi.addMethod('/GET');
                rootResourceApi.addMethod('/POST');

        const subResouceApi = rootResourceApi.addResource('{id}');
        subResouceApi.addMethod('/GET');
        subResouceApi.addMethod('/PUT');
        subResouceApi.addMethod('/DELETE');

        
    }
}