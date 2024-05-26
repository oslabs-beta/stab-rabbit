const { GraphQLScalarType, Kind } = require('graphql');

const ApolloMaticMixedScalar = new GraphQLScalarType({
  name: 'ApolloMaticMixedScalar',
  description: 'A custom scalar for representing mixed data types in Apollomatic applications',

  serialize(value) {
    // Serialize the value directly
    return value;
  },

  parseValue(value) {
    // Parse the value directly
    return value;
  },

  parseLiteral(ast) {
    // Parse the AST value directly
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.INT:
      case Kind.FLOAT:
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.OBJECT:
        return Object.fromEntries(
          ast.fields.map(field => [field.name.value, field.value])
        );
      case Kind.LIST:
        return ast.values.map(value => value.value);
      default:
        return null;
    }
  }
});

module.exports = ApolloMaticMixedScalar;

// Custom scalar type for representing mixed data types in Apollomatic applications.

// Note for Clients:

// - When sending mixed data values to the server in GraphQL mutations, ensure that the value is represented appropriately based on its type:
//   - Scalars (String, Int, Float, Boolean) can be sent directly.
//   - Objects should be represented as JSON objects.
//   - Arrays should be represented as JSON arrays.
  
// - When receiving mixed data values in GraphQL query responses, expect the values to be represented based on their types:
//   - Scalars will be represented as their respective scalar types.
//   - Objects will be represented as JSON objects.
//   - Arrays will be represented as JSON arrays.