import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
  IonButton, IonList, IonItem, IonLabel, IonCardSubtitle, IonBadge 
} from '@ionic/angular/standalone';
import { TicketService } from '../services/ticket.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonButton, IonList, IonItem, IonLabel, IonCardSubtitle, IonBadge
  ]
})
export class Tab3Page {
  constructor(public ticketService: TicketService) {}

  fecharFila() {
    this.ticketService.encerrarExpediente();
    alert('Expediente encerrado às 17h. Filas restantes limpas e descartadas!');
  }

  get relatorio() {
    return this.ticketService.obterDadosRelatorio();
  }
}