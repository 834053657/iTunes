// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  const authority = localStorage.getItem('kg-itunes-authority');
  return authority ? JSON.parse(authority) : '';
}

export function setAuthority(authority) {
  return localStorage.setItem('kg-itunes-authority', authority ? JSON.stringify(authority) : '');
}

// get user locale language
export function getLocale() {
  return localStorage.getItem('kg-itunes-locale');
}

export function setLocale(locale) {
  return localStorage.setItem('kg-itunes-locale', locale);
}
