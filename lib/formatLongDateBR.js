const OPTIONS = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export const formatLongDateBR = (date) => {
  const day = new Date(date);
  return day.toLocaleDateString('pt-BR', OPTIONS);
};

export const formatTimeBR = (date) => {
  const day = new Date(date);
  return day.toLocaleTimeString('pt-BR');
};
