import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

/** Comma-separated list of allowed browser origins; the first one is the public site. */
const clientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

export default {
  node_env: process.env.NODE_ENV,
  is_production: process.env.NODE_ENV === 'production',
  port: process.env.PORT,
  client_url: clientUrls[0],
  client_urls: clientUrls,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_challenge_secret:
    process.env.JWT_CHALLENGE_SECRET || process.env.JWT_ACCESS_SECRET,
  // Encrypts authenticator secrets at rest. Changing it invalidates every enrolled authenticator.
  totp_encryption_key:
    process.env.TOTP_ENCRYPTION_KEY || process.env.JWT_ACCESS_SECRET,
  totp_issuer: process.env.TOTP_ISSUER || 'Portfolio Dashboard',
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRE_IN || '15m',
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRE_IN || '7d',
  reset_pass_link: process.env.RESET_PASS_LINK,
  revalidate_secret: process.env.REVALIDATE_SECRET,
  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
};
