interface CookieProps {
  expires?: Date | number | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export const setCookie = (
  name: string,
  value: string,
  props?: CookieProps
): void => {
  let cookieString = `${name}=${value}`;

  if (props) {
    const options = { ...props };

    if (options.expires) {
      let expires: Date;

      if (options.expires instanceof Date) {
        expires = options.expires;
      } else if (typeof options.expires === 'number') {
        expires = new Date();
        expires.setTime(expires.getTime() + options.expires * 1000);
      } else {
        expires = new Date(options.expires);
      }

      cookieString += `; expires=${expires.toUTCString()}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += '; secure';
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }
  }

  document.cookie = cookieString;
};

export const getCookie = (name: string): string | undefined => {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const deleteCookie = (name: string): void => {
  setCookie(name, '', { expires: -1 });
};
