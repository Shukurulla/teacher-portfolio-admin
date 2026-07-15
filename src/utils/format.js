// Sana -> DD.MM.YYYY
export const formatDate = (input) => {
  if (!input) return "—";
  const d = new Date(input);
  if (isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
};

// Telefon -> +998 XX XXX XX XX
export const formatPhone = (phone) => {
  if (!phone) return "—";
  let d = String(phone).replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("998")) d = d.slice(3);
  if (d.length !== 9) return String(phone).trim();
  return `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(
    7,
    9
  )}`;
};
