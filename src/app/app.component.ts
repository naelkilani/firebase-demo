import { Component, OnDestroy } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'
import { Subscription, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  users$;
  users: any[];
  user$;
  user: any;
  subscription: Subscription;

  constructor(private db: AngularFireDatabase) {
  
   this.subscription = db.list('users').valueChanges().subscribe(users => {
     this.users = users;
     console.log(this.users);
   });

   this.users$ = db.list('users').snapshotChanges();

   db.object('users/1').valueChanges().subscribe(user => {
    this.user = user;
  });

   this.user$ = db.object('users/1').valueChanges();
  }

  onSubmit(f: NgForm) {
    this.db.list('users').push(f.value.user);
    f.reset(); 
  }

  onUpdate(user) {
    user = {
      key: user.payload.key,
      ...user.payload.val()
    };
    console.log(user);
     this.db.object(`users/${user.key}`).set( {
       name: `${user.name} UPDATED`,
       age: 100
     });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
