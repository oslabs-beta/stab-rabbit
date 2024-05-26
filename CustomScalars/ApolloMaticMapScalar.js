const { GraphQLScalarType, Kind } = require('graphql');

const ApolloMaticMapScalar = new GraphQLScalarType({
  name: 'ApolloMaticMapScalar',
  description: 'A custom scalar for representing key-value pairs in Apollomatic applications',

  serialize(value) {
    if (!(value instanceof Map)) {
      throw new TypeError('ApolloMaticMapScalar can only serialize Map objects');
    }
    return Object.fromEntries(value);
  },

  parseValue(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new TypeError('ApolloMaticMapScalar can only parse object values');
    }
    return new Map(Object.entries(value));
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.OBJECT) {
      throw new TypeError('ApolloMaticMapScalar can only parse object literals');
    }
    return new Map(ast.value.map(entry => [entry.name.value, entry.value.value]));
  }
});

module.exports = ApolloMaticMapScalar;


// Custom scalar type for representing key-value pairs in Apollomatic applications.

// Note for Clients:

// - When sending Map values to the server in GraphQL mutations, ensure that the value is represented as an 
// object to avoid loss of precision or truncation issues. This can be achieved by converting the Map value to a plain 
// JavaScript object before sending it to the server.
  
// - When receiving Map values in GraphQL query responses, expect the values to be represented as objects within JSON objects. 
// Clients may need to parse these objects back to Map values for further manipulation or display.
