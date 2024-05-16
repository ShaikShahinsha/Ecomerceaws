import * as cdk from 'aws-cdk-lib';

import { Construct } from 'constructs';
import { EcomDatabase } from './database';
import { EcomLambdaMicroService } from './lamdamicroservice';
import { EcomApiGatewayService } from './apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkTypescriptStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ecomDatabase = new EcomDatabase(this,'Database');
    const lambdaMicroService = new EcomLambdaMicroService(this,'LamdaMicroservice',{
      productTable: ecomDatabase.productTable
    });


    const ecomApiGateway = new EcomApiGatewayService(this,'EcomApiGateway',{
      productFunction: lambdaMicroService.productMicroService
    });



      // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkTypescriptQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    //Product m.s api gateway 
    // root name = product

    // GET /product 
    // POST /product

    // Single product with id parameter 
    // GET /product/{id}
    // PUT /product/{id}
    // DELETE /product/{id}
   
  }
}
