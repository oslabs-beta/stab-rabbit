
const mongoose = require('mongoose');
//this will hold all of the currentSchema's when they are converted to ApolloServer schemas
const convertedSchemas = {models :[]};
function convertSchemas(){
  const models = require('./index.js'); 
  // console.log('in convertSchemas')
    //iterate over all of the models
    for(const model in models){
        currentSchema = {
            name: model,
            schema: {},
        };
        const paths = models[model].schema.paths;

        //create an object to hold all of the fields that are nested
        const nestedFields = {};
        //iterate over each field in this model
        for(const field in paths){
          if(field != '__v' && field != '_id'){
            let resolved = false;
            const convertedType = convertField(field, paths, currentSchema);
            console.log(convertedType)
            // the next two lines ensure that the $* property isn't considered a nested object on a map
            const presplitMap = paths[field]._presplitPath && paths[field]._presplitPath[1] === '$*';
            const isNested = paths[field]._presplitPath.length > 1 && !presplitMap;
            // const isNested = false;
            console.log(paths[field])
            // console.log(paths[field]._presplitPath)
            if(!isNested){
              //this ensures map properties aren't added here (the '$*' property)
              if(!presplitMap){
                currentSchema.schema[field] = convertedType;
              }
              
            }else{//this is a nested field
              //logic to parse through nested fields
              let propertyReference = nestedFields;
              const pathLength = paths[field]._presplitPath.length;
              //iterate through _presplitPath
              for(let i = 0; i <= pathLength - 1; i ++){
                const prop = paths[field]._presplitPath[i];
                if(i === pathLength - 1){
                  propertyReference[prop] = convertedType;
                }else{
                  if(!propertyReference[prop]){
                    propertyReference[prop] = {};
                  }
                  propertyReference = propertyReference[prop];
                }
              }


            }
            
          }
        }
        
        //iterate over all of the nested schemas
        for(const [k,v] of Object.entries(nestedFields)){
          currentSchema.schema[k] = objectToString(v);
        }

        //convert the objects to strings,
        // add the k:v pair of fieldName: string object to convertedSchemas.models

    convertedSchemas.models.push(currentSchema)
    // console.log('n', nestedFields)
}

// console.log('All convertedSchemas', convertedSchemas)
return convertedSchemas;
}

function convertToApolloFieldType(mongooseType){
    
    const conversion = {
        Array: 'Array',//complex type                        
        ObjectId: 'ID',//semi complex type(I don't think that there is a need for recursion) - need to find the 'ref' property and make that the value added                                    
        Map: 'ApolloMaticMapScalar',//simple type - mongoose model will provide validation fo rthe db, so no need to worry about passing along the 'of' properties value to apolloserver                                         
        uuidValue: 'ID',//basic type                      
        bigIntValue: 'ApolloMaticBigIntScalar',//basic type   
        String: 'String',//basic type                    
        Number: 'Float',//basic type                         
        Boolean: 'Boolean',//basic type                      
        Date: 'ApolloMaticDateScalar',//basic type                        
        Buffer: 'ApolloMaticBufferScalar',//basic type 
        Mixed: 'ApolloMaticMixedScalar',//basic type - just no defined structure                      
        Decimal128: 'ApolloMaticDecimal128Scalar',//basic type  

          
    }
    return conversion[mongooseType];
}


function convertField(field, paths, currentSchema){
  //Array -> subdoc or regular
    const mongooseFieldType = paths[field].instance;
    
    
    const convertedType = convertToApolloFieldType(mongooseFieldType);

    
    if(convertedType === 'Array'){

      const isSubDoc = paths[field].caster['$isArraySubdocument'] || false;

      if(isSubDoc){

        // functionality to build out object, k:v pairs from invocation  of convertToApolloFieldType
        const arrayInnerPaths =   paths[field].caster.schema.paths;
        let typeObject = {};
        for(const innerField in arrayInnerPaths){
          const path = arrayInnerPaths[innerField]._presplitPath;
          const type = arrayInnerPaths[innerField].instance;

          let propertyReference = typeObject;
          for(let i = 0; i < path.length; i++){
            const prop = path[i];
            
            if(path.length === 1){ //This takes care of non nested properties
              propertyReference[prop] = convertToApolloFieldType(type);
            }else{//nested properties

              if(i === path.length - 1){//last of nested properties
                propertyReference[prop] = convertToApolloFieldType(type);
              }else{//property where value is an object that will eventuall add more properties
                if(!propertyReference[prop]){//if this doesn't already exist
                  propertyReference[prop] = {};// make it
                }
                propertyReference = propertyReference[prop];//reassign propertyReference to 
              }
            }
          }
    
        }
        // console.log('type object', typeObject)
        // console.log('type object with custom stringified' , objectToString(typeObject))
        // convert the object into a string (maybe another function)
        // return  [ stringified object ]
        return `[ ${objectToString(typeObject)} ]`;
      }else{//array with a basic type
        
        const innerArrayType = convertToApolloFieldType(paths[field].casterConstructor.caster.instance);
        return `[ ${innerArrayType} ]`
      }
    }
    if(field === '_id'){
      return convertedType + '!'
    }
      return  convertedType;
}

function objectToString(initialObject){
  // i: an object
  // o : object in a string form for apolloserver
  
  let builtString = '';
  function buildString(value){

    if(value.toString() === '[object Object]'){//the value is another object
      builtString += '{ '
      for(const [k, v] of Object.entries(value)){
        builtString += `${k}: `;
        buildString(v);
      }
      builtString += ' },'
      return;
    }else{//the value is a non-nested value
      //There may be an issue with the extra comma at the end of each objects k:v list
      builtString += `${value},`;
      return;
    }

  }
  buildString(initialObject)
  return builtString
}

    module.exports = {
      convertSchemas
    }
    // convertSchemas(models);
    // testStuff();