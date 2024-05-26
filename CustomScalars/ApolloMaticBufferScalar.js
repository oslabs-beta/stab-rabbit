const { GraphQLScalarType, Kind } = require('graphql');

const ApolloMaticBufferScalar = new GraphQLScalarType({
  name: 'ApolloMaticBufferScalar',
  description: 'A custom scalar for representing buffer values in Apollomatic applications',

  serialize(value) {
    if (!Buffer.isBuffer(value)) {
      throw new TypeError('ApolloMaticBufferScalar can only serialize Buffer objects');
    }
    // Convert Buffer to base64 string for serialization
    return value.toString('base64');
  },

  parseValue(value) {
    if (typeof value !== 'string') {
      throw new TypeError('ApolloMaticBufferScalar can only parse string values');
    }
    // Parse base64 string back to Buffer
    return Buffer.from(value, 'base64');
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError('ApolloMaticBufferScalar can only parse string literals');
    }
    // Parse base64 string back to Buffer
    return Buffer.from(ast.value, 'base64');
  }
});

module.exports = ApolloMaticBufferScalar;


// Custom scalar type for representing buffer values in Apollomatic applications.

// Note for Clients:

// - When sending Buffer values to the server in GraphQL mutations, ensure that the value is represented as a string in base64 format to ensure compatibility
//  and avoid data loss.
  
// - When receiving Buffer values in GraphQL query responses, expect the values to be represented as strings in base64 format. Clients may need to parse these 
// strings back to Buffer objects for further manipulation or use.
