import {  FingerprintsAuth, Finger } from "@digitalpersona/authentication";
import {AuthService, } from '@digitalpersona/services'

export const MatchFingerPrint = async (samples) => {
  try {
    const authService = new AuthService()
    const compare = new FingerprintsAuth();
    const result = await compare.identify(samples);
    if (result) {
      console.log(result);
      return result;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
