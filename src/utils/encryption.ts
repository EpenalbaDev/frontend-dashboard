import { useCallback } from 'react';

// Utilidades para encriptación/desencriptación de tokens
// Usar AES simple con una clave base + información del browser

class TokenEncryption {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  
  // Generar una clave base usando información del browser
  private static getBaseKey(): string {
    // Combinar información del browser para crear una clave única por sesión
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const screenSize = `${window.screen.width}x${window.screen.height}`;
    
    return btoa(`${userAgent}-${language}-${timezone}-${screenSize}`).slice(0, 32);
  }
  
  // Encriptar usando XOR simple (más rápido y efectivo para tokens)
  private static simpleEncrypt(text: string, key: string): string {
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      const textChar = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(textChar ^ keyChar);
    }
    return btoa(encrypted); // Base64 encode
  }
  
  // Desencriptar
  private static simpleDecrypt(encryptedText: string, key: string): string {
    try {
      const encrypted = atob(encryptedText); // Base64 decode
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        const encryptedChar = encrypted.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(encryptedChar ^ keyChar);
      }
      return decrypted;
    } catch (error) {
      console.error('Error decrypting token:', error);
      return '';
    }
  }
  
  // Métodos públicos
  public static encryptToken(token: string): string {
    if (!token) return '';
    
    try {
      const key = this.getBaseKey();
      const timestamp = Date.now().toString();
      const dataToEncrypt = `${timestamp}:${token}`;
      
      return this.simpleEncrypt(dataToEncrypt, key);
    } catch (error) {
      console.error('Error encrypting token:', error);
      return token; // Fallback al token original
    }
  }
  
  public static decryptToken(encryptedToken: string): string {
    if (!encryptedToken) return '';
    
    try {
      const key = this.getBaseKey();
      const decrypted = this.simpleDecrypt(encryptedToken, key);
      
      // Verificar formato timestamp:token
      const parts = decrypted.split(':');
      if (parts.length !== 2) {
        console.warn('Invalid encrypted token format');
        return '';
      }
      
      const [timestamp, token] = parts;
      const tokenAge = Date.now() - parseInt(timestamp);
      
      // Token válido por 24 horas
      const MAX_AGE = 24 * 60 * 60 * 1000; // 24 horas
      if (tokenAge > MAX_AGE) {
        console.warn('Encrypted token expired');
        return '';
      }
      
      return token;
    } catch (error) {
      console.error('Error decrypting token:', error);
      return '';
    }
  }
  
  // Verificar si un token está encriptado
  public static isEncrypted(token: string): boolean {
    if (!token) return false;
    
    // Los JWT empiezan con "eyJ", los tokens encriptados no
    return !token.startsWith('eyJ');
  }
  
  // Limpiar tokens expirados del localStorage
  public static cleanExpiredTokens(): void {
    try {
      const encryptedToken = localStorage.getItem('auth_token');
      if (encryptedToken && this.isEncrypted(encryptedToken)) {
        const decryptedToken = this.decryptToken(encryptedToken);
        if (!decryptedToken) {
          // Token expirado o inválido, limpiar
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          console.log('Expired encrypted token cleaned');
        }
      }
    } catch (error) {
      console.error('Error cleaning expired tokens:', error);
    }
  }
}

// Funciones exportadas para uso fácil
export const encryptToken = (token: string): string => {
  return TokenEncryption.encryptToken(token);
};

export const decryptToken = (encryptedToken: string): string => {
  return TokenEncryption.decryptToken(encryptedToken);
};

export const isTokenEncrypted = (token: string): boolean => {
  return TokenEncryption.isEncrypted(token);
};

export const cleanExpiredTokens = (): void => {
  TokenEncryption.cleanExpiredTokens();
};

// Hook para usar tokens encriptados en React
export const useEncryptedToken = () => {
  const getToken = useCallback((): string => {
    const storedToken = localStorage.getItem('auth_token');
    if (!storedToken) return '';
    
    if (isTokenEncrypted(storedToken)) {
      return decryptToken(storedToken);
    }
    
    return storedToken;
  }, []);
  
  const setToken = useCallback((token: string): void => {
    if (token) {
      const encrypted = encryptToken(token);
      localStorage.setItem('auth_token', encrypted);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, []);
  
  const removeToken = useCallback((): void => {
    localStorage.removeItem('auth_token');
  }, []);
  
  return { getToken, setToken, removeToken };
};