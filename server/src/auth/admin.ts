import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as admin from 'firebase-admin';

config();
const configService = new ConfigService();

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    configService.get('FIREBASE_SERVICE_ACCOUNT') || '{}',
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;
