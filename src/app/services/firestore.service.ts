import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public database: AngularFirestore) { }

  createDoc(data: any, path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<Tipo>(path: string, id: string) {
    const collection = this.database.collection<Tipo>(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: any, path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).update(data);
  }

  getId() {
    return this.database.createId();
  }

  getCollection<Tipo>(path: string) {
    const collection = this.database.collection<Tipo>(path);
    return collection.valueChanges();
  }

  getCollectionOrder<Tipo>(path: string) {
    const collection = this.database.collection<Tipo>(path, 
      ref => ref.orderBy('fecha', 'desc')
    );
    return collection.valueChanges();
  }

  getCollectionAllsimple<Tipo>(path: string) {
    const collection = this.database.collectionGroup<Tipo>(path);
    return collection.valueChanges();
  }

  getCollectionAllbyOrder<Tipo>(path: string) {
    const collection = this.database.collectionGroup<Tipo>(path,
      ref => ref.orderBy('fecha', 'desc')
    );
    return collection.valueChanges();
  }

  getCollectionAll<Tipo>(path, parametro: string, condicion: any, busqueda: string, startAt: any) {
    if (startAt == null) {
      startAt = new Date();
    }
    const collection = this.database.collectionGroup<Tipo>(path,
      ref => ref.where(parametro, condicion, busqueda)
                .orderBy('fecha', 'desc')
                // .limit(2)
                .startAfter(startAt)
    );
    return collection.valueChanges();
  }


}
