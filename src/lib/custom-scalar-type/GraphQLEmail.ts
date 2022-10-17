import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';
import { UserInputError } from 'apollo-server-express';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const validate = (value: any) => {
  if (typeof value !== 'string' || !EMAIL_REGEX.test(value)) {
    throw new GraphQLError(`Invalid email: ${value}`); // Haven't try parsing this error in frontend
  }

  return value;
};

export const CustomEmailScalar = new GraphQLScalarType({
  name: 'Email',
  description: 'A valid email address',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast: any) => {
    if (ast.king !== Kind.STRING) {
      throw new GraphQLError(
        `Query error: Can only parse strings as email addresses but got a: ${ast.kind}`,
      );
    }

    return validate(ast.value);
  },
});
