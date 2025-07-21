export function gerarDataPorExtenso(): string {
  const hoje = new Date();
  const dia = hoje.getDate();
  const ano = hoje.getFullYear();

  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  const mes = meses[hoje.getMonth()];

  return `${dia} de ${mes} de ${ano}`;
}


