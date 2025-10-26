import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { inject } from '@angular/core';
import { UserService } from '../auth/user-service';
export function apolloFactory() {
  const httpLink = inject(HttpLink);

  const userService = inject(UserService);
  const authLink = new ApolloLink((operation, forward) => {
    const token = userService.getToken();
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    }));

    return forward(operation);
  });

  return {
    link: authLink.concat(
      httpLink.create({
        uri: 'http://localhost:3000/graphql',
      }),
    ),
    cache: new InMemoryCache(),
  };
}
