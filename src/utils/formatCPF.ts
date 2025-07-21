export function formatCPF(cpf: string): string {
  if (!cpf) return '';
  const onlyDigits = cpf.replace(/\D/g, '');
  if (onlyDigits.length !== 11) return cpf;
  return onlyDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
