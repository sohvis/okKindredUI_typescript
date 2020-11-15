// https://github.com/preludek/pwnedpasswords/blob/master/src/App.js

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import sha1 from 'sha1';
import { configs } from '../config';


/*
 Class to use the Pwned Password Checker.
 It hashes the password and sends the first 5 characters of the hash to the API
 The API returns all the hashes starting with those 5 characters with the number of breaches

 The class then compares the rest of the hashed password with the API result and returns the
 number of times the password has been breached.
*/

export default class PwnedPasswordChecker {

    public static async getNumberOfPasswordBreaches(password: string): Promise<number> {
        // window.console.log(`PwnedPasswordChecker.getPasswordBreaches()`);

        if (!password || password.length < 6) {
            throw new Error('Password must have more than 5 characters');
        }

        const hashedPassword = sha1(password);

        const beginningHash = hashedPassword.slice(0, 5).toUpperCase();
        const endHash = hashedPassword.slice(-35).toUpperCase();

        const breaches = await PwnedPasswordChecker.fetchPasswords(beginningHash);

        const numBreaches = PwnedPasswordChecker.getNumBreaches(endHash, breaches);

        return numBreaches;
    }

    private static async fetchPasswords(beginningHash: string): Promise<string[]> {

        try {
            const url = `${configs.PwnedPasswordsAPI}${beginningHash}`;

            const response = await axios.get(url) as AxiosResponse<string>;
            return response.data.split('\n');

        } catch (ex) {
            // window.console.log(ex);
            return [];
        }
    }

    private static getNumBreaches(endHash: string, breaches: string[]): number {

        const passwordsMap = breaches.map((p) => p.slice(0, 35));

        const index = passwordsMap.indexOf(endHash);
        let leaks = 0;

        if (index >= 0) {
            leaks = Number(breaches[index].slice(36, -1)) * 1;
        }

        return leaks;
    }
}
