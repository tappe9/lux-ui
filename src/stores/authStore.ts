import { defineStore } from "pinia";
import { auth, googleProvider, signInWithPopup } from '../firebaseConfig';

import router from "@/router";

interface Profile {
  id: string;
  name: string;
  avatar: string;
  created: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    user: null,
    profile: null as Profile | null,
  }),

  persist: {
    enabled: true,
    strategies: [
      { storage: localStorage, paths: ["isLoggedIn"] },
      // { storage: sessionStorage, paths: ["profile"] }
    ],
  },

  getters: {},

  actions: {
    setLoggedIn(payload: boolean) {
      this.isLoggedIn = payload;
    },

    registerWithEmailAndPassword(email: string, password: string) {
      router.push("/");
    },

    loginWithEmailAndPassword(email: string, password: string) {
      router.push("/");
    },

    async loginWithGoogle() {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        this.user = result.user;
        this.isLoggedIn = true;
        router.push("/");
      } catch (error) {
        console.error("Error logging in with Google: ", error);
      }
    },

    async logout() {
      try {
        await auth.signOut();
        this.isLoggedIn = false;
        this.user = null;
        this.profile = null;
        router.push({ name: "auth-signin" });
      } catch (error) {
        console.error("Error logging out: ", error);
      }
    },
  },
});
