import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { strictEqual } from 'assert';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = "Sing In !";
  usuario: Usuario;

  constructor(
    private aunt: AuthService,
    private router: Router
  ) {
    this.usuario = new Usuario();
   }

  ngOnInit(): void {
    if (this.aunt.isAuthenticated()) {
      Swal.fire('Login',`Hola ${this.aunt.usuario.username} ya estas autenticado!`,'info');
      this.router.navigate(['/clientes']);
    }
  }

  login(): void{
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Error Login', 'Username o password vacías!','error');
      return;
    }
    this.aunt.login(this.usuario).subscribe(response =>{
      console.log(response);

      this.aunt.guardarUsuario(response.access_token);
      this.aunt.guardarToken(response.access_token);
      let usuario = this.aunt.usuario;
      this.router.navigate(['/clientes']);
      Swal.fire('Login',`Hola ${usuario.username}, has iniciado sesión con éxito!`,'success');
    }, err =>{
      if (err.status == 400) {
        Swal.fire('Error Login', 'Usuario o clave incorrectas!','error');
      }
    }
    )
  }

}
