const { GraphQLScalarType, Kind } = require('graphql');
const { Decimal128 } = require('mongodb'); // Assuming MongoDB Decimal128 type

const ApolloMaticDecimal128Scalar = new GraphQLScalarType({
  name: 'ApolloMaticDecimal128Scalar',
  description: 'A custom scalar for representing Decimal128 values in Apollomatic applications',

  serialize(value) {
    if (!(value instanceof Decimal128)) {
      throw new TypeError('ApolloMaticDecimal128Scalar can only serialize Decimal128 objects');
    }
    // Serialize Decimal128 value to string
    return value.toString();
  },

  parseValue(value) {
    if (typeof value !== 'string') {
      throw new TypeError('ApolloMaticDecimal128Scalar can only parse string values');
    }
    // Parse string value to Decimal128
    return Decimal128.fromString(value);
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError('ApolloMaticDecimal128Scalar can only parse string literals');
    }
    // Parse string literal to Decimal128
    return Decimal128.fromString(ast.value);
  }
});

module.exports = ApolloMaticDecimal128Scalar;


// Custom scalar type for representing Decimal128 values in Apollomatic applications.

// Note for Clients:

// - When sending Decimal128 values to the server in GraphQL mutations, ensure that the value is represented as a string to avoid loss of 
// precision or truncation issues. This can be achieved by converting the Decimal128 value to a string before sending it to the server.
  
// - When receiving Decimal128 values in GraphQL query responses, expect the values to be represented as strings. Clients may need to parse these 
// strings back to Decimal128 objects for further manipulation or display.
