

export const imgUrl = (text: string): string => {
  const baseUrl =process.env.NEXT_PUBLIC_BASE_URL;
  return `${baseUrl}${text}`;
};
