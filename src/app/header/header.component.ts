import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
  
})

export class HeaderComponent implements OnInit {
  curso="Angular con Spring";
  estudiante= "Alexander Espitia";
  
  constructor(
    public auth: AuthService,
    public router: Router,

  ) { }

  logout():void{
    
    Swal.fire('Logout', `Hola ${this.auth.usuario.username} has cerrado sesion con éxito!`,'success');
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
  }
 
}
