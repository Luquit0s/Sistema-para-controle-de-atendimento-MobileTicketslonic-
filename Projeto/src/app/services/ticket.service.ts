import { Injectable } from '@angular/core';

export interface Ticket {
  id: string;
  tipo: 'SP' | 'SG' | 'SE';
  status: 'Aguardando' | 'Atendido' | 'Desistente' | 'Descartada';
  horaEmissao: Date;
  horaAtendimento?: Date;
  guicheResponsavel?: number;
  tempoRetencao?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  public filaSP: Ticket[] = [];
  public filaSG: Ticket[] = [];
  public filaSE: Ticket[] = [];
  
  public ultimasChamadas: Ticket[] = [];
  public historicoGeral: Ticket[] = [];

  private contadores = { SP: 1, SG: 1, SE: 1 };
  private cicloAtual: number = 0;

  constructor() {}

  // --- AGENTE CLIENTE (AC): EMISSÃO DE SENHA ---
  emitirSenha(tipo: 'SP' | 'SG' | 'SE'): Ticket {
    const agora = new Date();
    
    // Formato exigido: YYMMDD
    const yy = agora.getFullYear().toString().slice(-2);
    const mm = String(agora.getMonth() + 1).padStart(2, '0');
    const dd = String(agora.getDate()).padStart(2, '0');
    
    // Sequência SQ com reinício diário
    const sq = String(this.contadores[tipo]).padStart(2, '0');
    this.contadores[tipo]++;

    const ticketId = `${yy}${mm}${dd}-${tipo}${sq}`;

    const novoTicket: Ticket = {
      id: ticketId,
      tipo: tipo,
      status: 'Aguardando',
      horaEmissao: agora
    };

    // Regra de Evasão/Desistência: 5% das senhas são descartadas de imediato
    if (Math.random() <= 0.05) {
      novoTicket.status = 'Desistente';
      this.historicoGeral.push(novoTicket);
      return novoTicket;
    }

    if (tipo === 'SP') this.filaSP.push(novoTicket);
    if (tipo === 'SG') this.filaSG.push(novoTicket);
    if (tipo === 'SE') this.filaSE.push(novoTicket);

    this.historicoGeral.push(novoTicket);
    return novoTicket;
  }

  // --- AGENTE ATENDENTE (AA): CHAMAR PRÓXIMO (Ciclo [SP] -> [SE|SG] -> [SP] -> [SE|SG]) ---
  chamarProximo(numeroGuiche: number): Ticket | null {
    let ticketEscolhido: Ticket | null = null;

    if (this.cicloAtual === 0) {
      if (this.filaSP.length > 0) {
        ticketEscolhido = this.filaSP.shift()!;
        this.cicloAtual = 1;
      } else if (this.filaSE.length > 0) {
        ticketEscolhido = this.filaSE.shift()!;
      } else if (this.filaSG.length > 0) {
        ticketEscolhido = this.filaSG.shift()!;
      }
    } else {
      if (this.filaSE.length > 0) {
        ticketEscolhido = this.filaSE.shift()!;
        this.cicloAtual = 0;
      } else if (this.filaSG.length > 0) {
        ticketEscolhido = this.filaSG.shift()!;
        this.cicloAtual = 0;
      } else if (this.filaSP.length > 0) {
        ticketEscolhido = this.filaSP.shift()!;
      }
    }

    if (ticketEscolhido) {
      ticketEscolhido.status = 'Atendido';
      ticketEscolhido.horaAtendimento = new Date();
      ticketEscolhido.guicheResponsavel = numeroGuiche;
      ticketEscolhido.tempoRetencao = this.calcularTempoRetencao(ticketEscolhido.tipo);

      this.ultimasChamadas.unshift(ticketEscolhido);
      if (this.ultimasChamadas.length > 5) {
        this.ultimasChamadas.pop();
      }
    }

    return ticketEscolhido;
  }

  // --- CÁLCULO ALEATÓRIO DO TM (TEMPO MÉDIO DE RETENÇÃO) ---
  private calcularTempoRetencao(tipo: 'SP' | 'SG' | 'SE'): number {
    const rand = Math.random();

    if (tipo === 'SP') {
      // Média 15 min (Variação de 5 min para mais ou para menos: 10 a 20 min)
      return 10 + Math.random() * 10;
    } 
    if (tipo === 'SG') {
      // Média 5 min (Variação de 3 min para mais ou para menos: 2 a 8 min)
      return 2 + Math.random() * 6;
    } 
    if (tipo === 'SE') {
      // Inferior a 1 min (0.5) para 95% dos casos, e 5 min para 5% dos casos
      return rand <= 0.95 ? 0.5 : 5.0;
    }
    return 0;
  }

  // --- ENCERRAMENTO DO EXPEDIENTE (17:00h) ---
  encerrarExpediente() {
    const descartarFila = (fila: Ticket[]) => {
      fila.forEach(ticket => ticket.status = 'Descartada');
    };

    descartarFila(this.filaSP);
    descartarFila(this.filaSG);
    descartarFila(this.filaSE);

    this.filaSP = [];
    this.filaSG = [];
    this.filaSE = [];
  }

  // --- OBTENÇÃO DOS DADOS PARA OS RELATÓRIOS ---
  obterDadosRelatorio() {
    const emitidas = this.historicoGeral.length;
    const atendidas = this.historicoGeral.filter(t => t.status === 'Atendido').length;
    const desistentes = this.historicoGeral.filter(t => t.status === 'Desistente').length;
    const descartadas = this.historicoGeral.filter(t => t.status === 'Descartada').length;

    const obterMediaTM = (tipo: 'SP' | 'SG' | 'SE') => {
      const lista = this.historicoGeral.filter(t => t.tipo === tipo && t.tempoRetencao);
      if (lista.length === 0) return 0;
      const soma = lista.reduce((acc, t) => acc + (t.tempoRetencao || 0), 0);
      return soma / lista.length;
    };

    return {
      emitidas,
      atendidas,
      desistentes,
      descartadas,
      mediaTM_SP: obterMediaTM('SP'),
      mediaTM_SG: obterMediaTM('SG'),
      mediaTM_SE: obterMediaTM('SE'),
      detalhado: this.historicoGeral
    };
  }
}