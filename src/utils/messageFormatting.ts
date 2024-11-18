export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const brazilTime = date.toLocaleString('pt-BR', options);
  const [datePart] = date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short' }).split(',');
  const [nowDatePart] = now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short' }).split(',');

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const [yesterdayDatePart] = yesterday.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short' }).split(',');

  if (datePart === nowDatePart) {
    return `Hoje, ${brazilTime}`;
  } else if (datePart === yesterdayDatePart) {
    return `Ontem, ${brazilTime}`;
  } else {
    return date.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
};

export const removeEmojis = (text: string) => {
  let modifiedText = text.replace(/🟢/g, '-');
  modifiedText = modifiedText.replace(/️(\s*)ALAVANCAGEM ISOLADA/, '$1ALAVANCAGEM ISOLADA');
  return modifiedText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
};

export const formatMessage = (text: string) => {
  const lines = removeEmojis(text).split('\n');
  
  if (lines[0].includes('Take - Profit')) {
    return formatTakeProfit(lines);
  } else if (lines[0].includes('COMPRA')) {
    return formatCompra(lines);
  } else if (lines[0].includes('VENDA')) {
    return formatVenda(lines);
  } else if (lines[0].includes('cancelado')) {
    return formatCancelado(lines);
  }
  
  return null;
};

const formatTakeProfit = (lines: string[]) => {
  const [header, type, alvo, lucro, periodo] = lines;
  
  return {
    type: 'take-profit',
    header: header.replace('#', '').trim(),
    data: {
      type: type,
      alvo: alvo && alvo.includes(':') ? alvo.split(':')[1].trim() : 'N/A',
      lucro: lucro && lucro.includes(':') ? lucro.split(':')[1].trim() : 'N/A',
      periodo: periodo && periodo.includes(':') ? periodo.split(':')[1].trim() : 'N/A'
    }
  };
};

const formatCompra = (lines: string[]) => {
  const [header, ...rest] = lines;
  let entradaZona = '', alavancagem = '', stoploss = '';
  const alvos: string[] = [];

  rest.forEach(line => {
    if (line.toLowerCase().includes('entrada na zona')) entradaZona = line;
    if (line.toLowerCase().includes('alavancagem isolada')) alavancagem = line;
    if (line.toLowerCase().includes('alvos:')) {
      alvos.push(...line.split(':')[1].split('-').map(a => a.trim()));
    }
    if (line.toLowerCase().includes('stooploss')) stoploss = line;
  });

  return {
    type: 'compra',
    header: header.replace('#', '').trim(),
    data: {
      entradaZona,
      alavancagem,
      alvos,
      stoploss
    }
  };
};

const formatVenda = (lines: string[]) => {
  // Similar ao formatCompra, mas com type: 'venda'
  const result = formatCompra(lines);
  return { ...result, type: 'venda' };
};

const formatCancelado = (lines: string[]) => {
  const [header, ...rest] = lines;
  let message = rest.join(' ').replace('@FuturosTech', '').trim();
  if (message.endsWith('<')) message = message.slice(0, -1) + '.';
  else if (!message.endsWith('.')) message += '.';

  return {
    type: 'cancelado',
    header: header.replace('#', '').trim(),
    message
  };
}; 