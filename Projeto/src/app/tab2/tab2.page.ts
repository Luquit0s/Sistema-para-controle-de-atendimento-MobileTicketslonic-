import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
  IonButton, IonItem, IonLabel, IonInput, IonBadge, IonList, IonCardSubtitle
} from '@ionic/angular/standalone';
import { TicketService, Ticket } from '../services/ticket.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonButton, IonItem, IonLabel, IonInput, IonBadge, IonList, IonCardSubtitle
  ]
})
export class Tab2Page {
  guicheId: number = 1;
  senhaAtual: Ticket | null = null;
  historicoGuiche: Ticket[] = [];

  constructor(private ticketService: TicketService) {}

  chamarProximo() {
    this.senhaAtual = this.ticketService.chamarProximo(this.guicheId);
    if (this.senhaAtual) {
      // Adiciona ao topo da lista de histórico do guichê atual
      this.historicoGuiche.unshift(this.senhaAtual);
    } else {
      alert('Nenhum cliente aguardando nas filas!');
    }
  }

  limparTelaGuiche() {
    this.senhaAtual = null;
    this.historicoGuiche = [];
  }
}