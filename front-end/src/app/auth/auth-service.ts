import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
const LOGIN = gql`
  mutation ($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password })
  }
`;
const SIGNUP = gql`
  mutation signup(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $username: String!
  ) {
    signup(
      createUserInput: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
        username: $username
      }
    ) {
      user {
        id
        email
      }
      accessToken
    }
  }
`;
interface RegisterData {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  username: string;
}

interface DataRegister {
  accessToken:string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly apollo: Apollo,
    private toastr: ToastrService,
  ) {}
  register({ firstName, lastName, email, password, username }: RegisterData) :Observable<DataRegister>{
    return this.apollo
      .mutate({ mutation: SIGNUP, variables: { firstName, lastName, email, password, username } })
      .pipe(
        map((result:any)=>{
        return result.data.signup;
        }));
  }

  login(email: string, password: string) {
    this.toastr.success('hello');
    return this.apollo
      .mutate({
        mutation: LOGIN,

        variables: { email: email, password: password },
      }).pipe(
        map((result:any)=>{
        return result.data.login;
        }));
  }

  logout(): void {
    localStorage.removeItem('token');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.roles.includes(role);
  }
}
