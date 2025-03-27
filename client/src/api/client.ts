const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  return res.json();
};
