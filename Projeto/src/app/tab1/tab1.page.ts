import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
  IonButton, IonBadge 
} from '@ionic/angular/standalone';
import { TicketService, Ticket } from '../services/ticket.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonButton, IonBadge
  ]
})
export class Tab1Page {
  senhaGerada: Ticket | null = null;

  constructor(private ticketService: TicketService) {}

  gerarSenha(tipo: 'SP' | 'SG' | 'SE') {
    this.senhaGerada = this.ticketService.emitirSenha(tipo);
  }
}