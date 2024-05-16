import { IFunction } from "aws-cdk-lib/aws-lambda";
import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";


interface EcomApiGatewaProps{
    
    productFunction : IFunction;
}
export class EcomApiGatewayService extends Construct {

    constructor(scope:Construct, id:string, props: EcomApiGatewaProps){
        super(scope,id);

        
        const apigw = new LambdaRestApi(this,'productApi',{
            restApiName:'Product Service',
            handler : props.productFunction,
            proxy: false
          });
      
          const product = apigw.root.addResource('product');
          product.addMethod('GET');
          product.addMethod('POST');
          
          const singleProduct = product.addResource('{id}');
          singleProduct.addMethod('GET'); //GET /product/{id}
          singleProduct.addMethod('PUT'); // PUT /product/{id}
          singleProduct.addMethod('DELETE'); 
    }
}