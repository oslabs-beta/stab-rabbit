#!/usr/bin/env node

const fs = require('fs'); 
const path = require('path');
const mongoose = require('mongoose');
const userRootDir = process.cwd();
const schemas = require(path.join(userRootDir,'apollo-config.js'));
const exportModels = {
  "models": [
]}
const typesFunction = require('./jsonToGraphQLTypes');
const resolversFunction = require('./jsonToResolvers');
const findSchemas = require('./findSchemas'); 
const { convertSchemas, convertType } = require('./mongooseToJSON')

//
let configFilePath = findSchemas(); 

if (configFilePath) {
  const schemas = require(configFilePath);
  module.exports = schemas; 
} else {
  console.error('Configuration file not found.');
}

//parse the mongo schema and convert it into a JSON object
let parsedMongoSchema = convertSchemas(); 
console.log(parsedMongoSchema)
// console.log('Output of convertSchema: ')
// console.log(JSON.stringify(parsedMongoSchema))
// console.log('End output of convertSchema: ')
// Generate GraphQL types and resolvers based on parsed schema
const graphQLTypes = typesFunction(parsedMongoSchema);
const graphQLResolvers = resolversFunction(parsedMongoSchema, schemas);



// Write to file

  
function writeTypesToFile(graphQLTypes) {
  // Create directory if it doesn't exist
  if (!fs.existsSync('src')) {   
    fs.mkdirSync('src');
  }
  //also write to their file: const { ApolloServer, gql } = require('apollo-server');
    fs.writeFileSync(`src/schema.js`, graphQLTypes);
  
}

writeTypesToFile(graphQLTypes);

function writeResolvesToFile(graphQLResolvers) {
  if (!fs.existsSync('resolvers')) {
    fs.mkdirSync('resolvers');
  }

  fs.writeFileSync('resolvers/index.js', graphQLResolvers);
}

writeResolvesToFile(graphQLResolvers);
