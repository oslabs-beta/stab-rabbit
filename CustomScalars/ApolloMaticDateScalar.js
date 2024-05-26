const { GraphQLScalarType, Kind } = require('graphql');

const ApollomaticDateScalar = new GraphQLScalarType({
  name: 'ApollomaticDateScalar',
  description: 'A custom scalar for representing date values in Apollomatic applications',

  serialize(value) {
    if (!(value instanceof Date)) {
      throw new TypeError('ApollomaticDateScalar can only serialize Date objects');
    }
    // Assuming ISO string format for serialization
    return value.toISOString();
  },

  parseValue(value) {
    if (typeof value !== 'string') {
      throw new TypeError('ApollomaticDateScalar can only parse string values');
    }
    // Parsing ISO string format
    return new Date(value);
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError('ApollomaticDateScalar can only parse string literals');
    }
    // Parsing ISO string format
    return new Date(ast.value);
  }
});

module.exports = ApollomaticDateScalar;


// Custom scalar type for representing date values in Apollomatic applications.

// Note for Clients:

// - When sending Date values to the server in GraphQL mutations, ensure that the value is 
// represented as a string in ISO 8601 format (e.g., "YYYY-MM-DDTHH:mm:ss.sssZ") to ensure compatibility and avoid ambiguity.
  
// - When receiving Date values in GraphQL query responses, expect the values to be represented as strings in ISO 8601 format. 
// Clients may need to parse these strings back to Date objects for further manipulation or display.
