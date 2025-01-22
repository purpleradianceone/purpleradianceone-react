import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
    exp?: number;
    userId?: string;
    [key: string]: unknown;
}

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        console.log(jwtDecode<DecodedToken>(token));
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error('Token decoding failed:', error);
        return null;
    }
};
export const isTokenExpired = (token: string): boolean => {
    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
};
