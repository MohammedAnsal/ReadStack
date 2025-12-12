export const decodeJWT = (token: string): { id?: string } | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem("access-token");
  if (!token) return null;
  const decoded = decodeJWT(token);
  return decoded?.id || null;
};
