// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  const authority = localStorage.getItem(`kg-itunes-authority-${__KG_API_ENV__}`);
  return authority ? JSON.parse(authority) : '';
}

export function setAuthority(authority) {
  return localStorage.setItem(
    `kg-itunes-authority-${__KG_API_ENV__}`,
    authority ? JSON.stringify(authority) : ''
  );
}

// get user locale language
export function getLocale() {
	const browserLang = navigator.browserLanguage ? navigator.browserLanguage : navigator.language;
	let defLang = 'zh-CN';
	if (browserLang.indexOf('en') > -1) defLang = 'en-GB';

  return localStorage.getItem(`kg-itunes-locale-${__KG_API_ENV__}`) || defLang;
}

export function setLocale(locale) {
  return localStorage.setItem(`kg-itunes-locale-${__KG_API_ENV__}`, locale);
}
