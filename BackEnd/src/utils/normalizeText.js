export const normalizeText = (
  input = ""
) => {
  return input
    .toLowerCase()
    .trim()
    .replace(/\./g, "")
    .replace(
      /[,\(\)\[\]\/\\\-]/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
};