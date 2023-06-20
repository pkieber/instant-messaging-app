import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SidenavService } from './../../shared/services/sidenav.service';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';
import { DialogUserEditComponent } from '../dialog-user-edit/dialog-user-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})

export class DialogUserComponent implements OnInit {

  users: any;
  userId: string = '';
  user: User = new User();
  isSidenavHidden = false;

  // Import des Firestore Services
  constructor(
    private firestore: Firestore,
    private sidenavService: SidenavService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog
    ) { }


  ngOnInit() {
    // OnInit wird aufgerufen und aus Firestore wird die Collection 'users' abgerufen.
    // Danach wird die Collection in ein Observable umgewandelt und in this.users gespeichert.
    // Innerhalb der Subscription kann man auf die Daten zugreifen und diese kopieren.
    const collectionInstance = collection(this.firestore, 'users');
    this.users = collectionData(collectionInstance);
    this.users.subscribe((data: any) => {
      console.log('Got data', data); // TEST
    });
    /**
     * Subscribes to route parameter changes and fetches user data.
     * User ID is extracted from the route parameters.
     * Fetches user data based on the retrieved user ID.
     */
    this.route.paramMap.subscribe(paramMap => {
      this.userId = paramMap.get('id') ?? '';
      this.getUser();
    });

    this.sidenavService.sidenavOpened.subscribe(() => {
      this.isSidenavHidden = false;
    });
  }

  /**
   * Retrieves user data from Firestore based on the provided user ID.
   * Subscribes to the document data and maps it to a User object.
   * 'userCollection' is a firestore collection representing the 'users' collection.
   * 'docRef' is a document reference representing a specific user document.
   */
  getUser() {
    const userCollection = collection(this.firestore, 'users');
    const docRef = doc(userCollection, this.userId);

    docData(docRef).subscribe((userCollection: any) => {
      this.user = new User(userCollection);
    });
  }


  /**
   * Opens input fields to edit user info.
   */
  openDialogUserEdit() {
    const dialog = this.dialog.open(DialogUserEditComponent);
    dialog.componentInstance.user = new User(this.user.toJson());
    dialog.componentInstance.userId = this.userId;
  }


  closeSidenav() {
    this.isSidenavHidden = true;
  }
}