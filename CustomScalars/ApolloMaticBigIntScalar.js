const { GraphQLScalarType, Kind } = require('graphql');

const ApolloMaticBigIntScalar = new GraphQLScalarType({
  name: 'ApolloMaticBigIntScalar',
  description: 'A custom scalar for representing large integer values in Apollomatic applications',

  serialize(value) {
    if (typeof value !== 'bigint') {
      throw new TypeError('ApolloMaticBigIntScalar can only serialize BigInt values');
    }
    return String(value);
  },

  parseValue(value) {
    if (typeof value !== 'string') {
      throw new TypeError('ApolloMaticBigIntScalar can only parse string values');
    }
    return BigInt(value);
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError('ApolloMaticBigIntScalar can only parse string literals');
    }
    return BigInt(ast.value);
  }
});

module.exports = ApolloMaticBigIntScalar;


// Custom scalar type for representing large integer values in Apollomatic applications.

// Note for Clients:

// - When sending BigInt values to the server in GraphQL mutations, ensure that the value is represented as a string to avoid loss of precision or truncation issues. This can be achieved by converting the BigInt value to a string before sending it to the server.
  
// - When receiving BigInt values in GraphQL query responses, expect the values to be represented as strings within JSON objects. Clients may need to parse these strings back to BigInt values for further manipulation or display.



