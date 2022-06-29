import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  url = 'https://procyonproject.link';
  urlDocumentacion = "https://procyonproject.link/documentacion";

  constructor(public menucontroler: MenuController) { }

  ngOnInit() {}

  openMenu() {
    this.menucontroler.toggle('principal');
  }

}
