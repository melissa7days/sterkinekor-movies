import { Component, OnInit } from '@angular/core';
import { MovieApiService } from '../movie-api.service';
import { Movie } from '../movies';
import {NgControl} from '@angular/forms';
@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})

export class MovieComponent implements OnInit {
  movie:string;
  movies=[]
  constructor(private _http:MovieApiService) { }

  ngOnInit(): void {
    this._http.SendMovies()
    .then(res=>this.movies=res.Search)
  }
  /* this */

  isShow = false;
 
  toggleDisplay() {
    this.isShow = !this.isShow;
  }
}
