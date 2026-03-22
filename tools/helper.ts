export function formatCPF(cpf: string): string {
  // Remove all non-digit characters
  cpf = cpf.replace(/\D/g, '');

  // Apply CPF mask: 000.000.000-00
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}