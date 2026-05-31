import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export const FirebaseProvider = {
  provide: 'FIREBASE_ADMIN',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    if (!admin.apps.length) {
      const raw = configService.get<string>('FIREBASE_SERVICE_ACCOUNT')!;
      const serviceAccount = JSON.parse(raw.replace(/\\n/g, '\\n'));

      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
    }
    return admin;
  },
};
