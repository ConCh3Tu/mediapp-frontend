import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: string;
  roles:[];

  constructor() { }

  ngOnInit(): void {

      let token = sessionStorage.getItem(environment.TOKEN_NAME);

      const helper = new JwtHelperService();

      let decodedToken = helper.decodeToken(token);

      this.usuario = decodedToken.user_name;
      this.roles = decodedToken.authorities;
  }

}
