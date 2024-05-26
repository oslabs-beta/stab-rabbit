const jsonToGraphQLTypes = (jsonObj) => {
  
  const customScalars = 'scalar ApolloMaticDateScalar\nscalar ApolloMaticBufferScalar\nscalar ApolloMaticMixedScalar\nscalar ApolloMaticMapScalar\nscalar ApolloMaticBigIntScalar\nscalar ApolloMaticDecimal128Scalar\n\n';
  let customScalarRequires = '\nconst ApolloMaticDateScalar = require(\'../node_modules/apollomatic/CustomScalars/ApolloMaticDateScalar.js\');'
  customScalarRequires +='\nconst ApolloMaticBufferScalar = require(\'../node_modules/apollomatic/CustomScalars/ApolloMaticBufferScalar.js\');'
  customScalarRequires +='\nconst ApolloMaticMixedScalar = require(\'../node_modules/apollomatic/CustomScalars/ApolloMaticMixedScalar.js\');'
  customScalarRequires +='\nconst ApolloMaticMapScalar = require(\'../node_modules/apollomatic/CustomScalars/ApolloMaticMapScalar.js\');'
  customScalarRequires +='\nconst ApolloMaticBigIntScalar = require(\'../node_modules/apollomatic/CustomScalars/ApolloMaticBigIntScalar.js\');'
  customScalarRequires +='\nconst ApolloMaticDecimal128Scalar = require(\'../node_modules/apollomatic/CustomScalars/ApolloMaticDecimal128Scalar.js\');'
  
  let typeQuery = 'type Query {\n';
  let typeMutation = 'type Mutation {\n';
  let typeDefs = '';
  let typeInputs = '';

  jsonObj.models.forEach((model) => {
      const typeName = model.name;
      let typeDef = `type ${typeName} {\n  id: ID!\n`;
      let typeInput = `input ${typeName}Input {\n`;

      // Generate Query Type Definitions
      typeQuery += `  ${typeName.toLowerCase()}(id: ID!): ${typeName}\n`;
      typeQuery += `  ${typeName.toLowerCase()}s: [${typeName}]\n`;

      // Generate Mutation Type Definitions
      typeMutation += `  create${typeName}(input: ${typeName}Input!): ${typeName}\n`;
      typeMutation += `  update${typeName}(id: ID!, input: ${typeName}Input!): ${typeName}\n`;
      typeMutation += `  delete${typeName}(id: ID!): ${typeName}\n`;

      const RemoveJSONQuotes = (jsonString) => {
      
      let retStr = "";
      for(let i = 0; i < jsonString.length; i++){
        if(jsonString[i] === '}') retStr += ' ';
        if(jsonString[i] !== '"') retStr += jsonString[i];
        if(jsonString[i] === ',' || jsonString[i] === ':' || jsonString[i] === '{') retStr += " ";
        
      }
      return retStr;
      
      }
      const TypeDefGeneration = (model) => {

        // Generate Type Definitions
        for (const [key, value] of Object.entries(model.schema)) {
          if(typeof value === 'object'){
            typeDef += `  ${key}: ${RemoveJSONQuotes(JSON.stringify(value))}\n`;
          }else{
            typeDef += `  ${key}: ${value}\n`;
          } 
          typeInput += `  ${key}: ${value}\n`;
      }
  }
      TypeDefGeneration(model);
      
  
      typeDef += '}\n\n';
      typeDefs += typeDef;
      typeInput += '}\n\n';
      typeInputs += typeInput;
  });

  // Close the Query and Mutation types
  typeQuery += '}\n\n';
  typeMutation += '}\n\n';

  // return `const typeDefs = gql\` \n${typeQuery} ${typeMutation} ${typeDefs}\``;
  return `const { gql } = require('apollo-server-express');${customScalarRequires}\n\nconst typeDefs = gql\` \n${customScalars} ${typeDefs} ${typeInputs} ${typeQuery} ${typeMutation}\` \n\nmodule.exports = typeDefs;`;
};
module.exports = jsonToGraphQLTypes;