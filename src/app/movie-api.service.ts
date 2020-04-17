import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Movie} from './movies';
import { Observable,of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MovieApiService {
movies=[];
private moviesUrl = 'http://www.omdbapi.com/?s=batman&apikey=fd23020c';
  constructor(private http:HttpClient) { }
  searchMovies(term:string):Observable<Movie[]>{
    if(!term.trim())
    {
      return of([]);
    }
    return this.http.get<Movie[]>(`${this.moviesUrl}`);
  }

  FetchDefaultMovies(){
    return fetch(this.moviesUrl)
    .then(response=>response.json());
  }
  SearchMovie(){
    return fetch(this.moviesUrl)
          .then(Response=>Response.json())
  }

  SendMovies(){
   return fetch('http://www.omdbapi.com/?s=batman&apikey=fd23020c')
    .then(response=>response.json());
   }
}