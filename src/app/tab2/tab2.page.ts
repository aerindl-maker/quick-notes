
import { Component, OnDestroy } from '@angular/core';

import {
  AlertController,
  ToastController
} from '@ionic/angular';

import {
  FirebaseService,
  Note
} from '../../services/firebase.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements OnDestroy {

  notes: Note[] = [];

  searchText = '';

  private unsubscribe: (() => void) | undefined;

  constructor(
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ionViewWillEnter() {
    this.loadNotes();
  }

  ionViewWillLeave() {

    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }

  }

  ngOnDestroy() {

    if (this.unsubscribe) {
      this.unsubscribe();
    }

  }

  loadNotes() {

    if (this.unsubscribe) {
      this.unsubscribe();
    }

    this.unsubscribe =
      this.firebaseService.listenToNotes((notes: Note[]) => {

        this.notes = notes;

      });

  }

  get filteredNotes(): Note[] {

    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      return this.notes;
    }

    return this.notes.filter(note =>

      note.title.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search) ||
      note.category.toLowerCase().includes(search)

    );

  }

  async updateNote(note: Note) {

    const alert = await this.alertController.create({

      header: 'Update Note',

      inputs: [

        {
          name: 'title',
          type: 'text',
          value: note.title,
          placeholder: 'Note Title'
        },

        {
          name: 'content',
          type: 'textarea',
          value: note.content,
          placeholder: 'Note Content'
        },

        {
          name: 'category',
          type: 'text',
          value: note.category,
          placeholder: 'Category'
        }

      ],

      buttons: [

        {
          text: 'Cancel',
          role: 'cancel'
        },

        {
          text: 'Update',

          handler: async (data) => {

            if (
              !data.title?.trim() ||
              !data.content?.trim() ||
              !data.category?.trim()
            ) {

              await this.showToast(
                'Please complete all fields.'
              );

              return false;

            }

            try {

              await this.firebaseService.updateNote({

                id: note.id,

                title: data.title.trim(),

                content: data.content.trim(),

                category: data.category.trim()

              });

              await this.showToast(
                'Note updated successfully!'
              );

              return true;

            } catch (error) {

              console.error(
                'Error updating note:',
                error
              );

              await this.showToast(
                'Failed to update note.'
              );

              return false;

            }

          }

        }

      ]

    });

    await alert.present();

  }

  async deleteNote(note: Note) {

    if (!note.id) {
      return;
    }

    const alert = await this.alertController.create({

      header: 'Delete Note',

      message: 'Are you sure you want to delete this note?',

      buttons: [

        {
          text: 'Cancel',
          role: 'cancel'
        },

        {
          text: 'Delete',
          role: 'destructive',

          handler: async () => {

            try {

              await this.firebaseService.deleteNote(
                note.id!
              );

              await this.showToast(
                'Successfully Deleted!'
              );

            } catch (error) {

              console.error(
                'Error deleting note:',
                error
              );

              await this.showToast(
                'Failed to delete note.'
              );

            }

          }

        }

      ]

    });

    await alert.present();

  }

  doRefresh(event: any) {

    this.loadNotes();

    event.target.complete();

  }

  async showToast(message: string) {

    const toast = await this.toastController.create({

      message: message,

      duration: 1800,

      position: 'bottom'

    });

    await toast.present();

  }

}