import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { PrimaryKey } from "aws-cdk-lib/aws-appsync";
import { join } from "path";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
export class MyCdkType extends cdk.Stack{

    constructor(scope: Construct , id: string, props?: cdk.StackProps){
        super(scope, id, props);

    


    const productTable = new Table(this,'product',{
        partitionKey:{
            name: 'id',
            type: AttributeType.STRING
        },
        tableName: 'product',
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        billingMode: BillingMode.PAY_PER_REQUEST  
    
    })

    const nodeJsFunctionProps:NodejsFunctionProps={
        bundling: {
            externalModules:[
                'aws-sdk'
            ]
        },
        environment:{
            PRIMARY_KEY : 'id',
            DYANAMODB_TABLE_NAME: productTable.tableName 
        },

        runtime:Runtime.NODEJS_20_X

    };

    //Product Microservice lambda function

    const productFunction = new NodejsFunction(this,'productLamdbaFucntion',{
        entry:join(__dirname,`/../src/product/index.js`),
        ...nodeJsFunctionProps
    });

    productTable.grantReadWriteData(productFunction);


    //add apigateway to trigger lamdba....
    // mamin resourcename is /product (root)

        //root name = product

        //GET /product 
        // POST /product 

        //Single product with id parameter
        // GET /product/{id}
        // PUT /product/{id}
        //DELETE /product/{id}

        const apigw = new LambdaRestApi(this, 'productLambdaApi',{
            restApiName: `Product Service`,
            handler: productFunction,
            proxy: false
        });

        const rootResource = apigw.root.addResource('product');
        rootResource.addMethod('GET');
        rootResource.addMethod('POST');

        const singleProduct = rootResource.addResource('{id}');
        singleProduct.addMethod('GET');
        singleProduct.addMethod('PUT');
        singleProduct.addMethod('DELETE');
    }

}