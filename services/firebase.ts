
// Em um cenário real, você substituiria as chaves abaixo pelas do seu console Firebase
// Configuração -> Geral -> Seus Aplicativos -> Web App
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSy_FAKE_KEY_FOR_MOCK",
  authDomain: "geoponto-pro.firebaseapp.com",
  projectId: "geoponto-pro",
  storageBucket: "geoponto-pro.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Como o usuário não sabe programar, aqui deixamos o esqueleto.
// No ambiente de produção, o sistema usaria as variáveis de ambiente.
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
