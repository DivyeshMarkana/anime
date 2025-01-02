import { Injectable } from '@angular/core';
import { collection, addDoc, Firestore, onSnapshot, deleteDoc, updateDoc, doc } from '@angular/fire/firestore';

import { Auth, createUserWithEmailAndPassword, setPersistence, getAuth, browserSessionPersistence, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';
// import { getDatabase, ref, set, remove, onValue } from "firebase/database";
import { AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  error: string
  token: string
  itemRef: AngularFireList<any>

  constructor(public auth: Auth, private firestore: Firestore, private router: Router) { }

  // getData(store: string, dataArray) {
  //   const databaseInstance = collection(this.firestore, store);

  //   onSnapshot(databaseInstance, snapshot => {
  //     let data: any[] = []
  //     snapshot.forEach(doc => {
  //       data.push({ ...doc.data(), id: doc.id })
  //       dataArray = data;
  //       console.log(dataArray);

  //     });
  //   })
  // }


  logIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password).then((response) => {
      console.log(response.user);

      const user = response.user;

      // console.log(user);
      // debugger;

      user.getIdTokenResult().then(t => {
        this.token = t.token


        // // ! Add token to firestore

        // const dbInstance = collection(this.firestore, 'token')
        // const token = t.token
        // addDoc(dbInstance, { token }).then(() => {
        //   console.log('token added to firestore');

        // }).catch((err) => {
        //   alert(err.message)
        // })

        // // ! ends

        //  ! add token to realtime

        // const db = getDatabase()
        // set(ref(db, 'token/'), this.token)


        // ! Add token to local storages
        // if (!localStorage.getItem('user-token')) {
        localStorage.setItem('token', JSON.stringify(this.token));
        localStorage.setItem('userId', user.uid);
        sessionStorage.setItem('userId', user.uid);
        // }
        // this.loggedIn()
        this.router.navigate(['/dashboard']);
      });
    }).catch((err) => {
      // console.log({ err });

      if (err.message.indexOf('user-not-found')) {
        this.error = 'This email is not registerd.'
      }

      if (err.message.indexOf('wrong - password')) {
        this.error = 'The password is incorrect.'
      }
    })
  }

  signIn(email: string, password: string) {
    setPersistence(this.auth, browserSessionPersistence)
      .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return signInWithEmailAndPassword(this.auth, email, password);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  googleSignIn() {
    const gAuth = getAuth()
    const provider = new GoogleAuthProvider()
    signInWithPopup(gAuth, provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      const user = result.user
      console.log(token);

      console.log(user);

      console.log('Successed');

    }).catch((err) => {
      alert(err.message)
    })
  }

  // loggedIn(): boolean {
  //   // const db = getDatabase()
  //   // set(ref(db, 'token/'), token)

  //   // return this.angularFirestore
  //   //   .collection('token')
  //   //   .snapshotChanges();

  //   const db = getDatabase()
  //   const logRef = ref(db, 'token/')
  //   const isLogin = onValue(logRef, (snapshot) => {
  //     console.log(snapshot.val());
  //     return snapshot.val();
  //   });

  //   console.log(isLogin);

  //   return !!isLogin


  //   // return !!isLogin
  // }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['login']);
    // this.itemRef.remove(this.token)

    // const db = getDatabase()
    // remove(ref(db, 'token/'))
  }

}
