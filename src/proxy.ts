import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // Match all pathnames except for internal Next.js paths and static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
