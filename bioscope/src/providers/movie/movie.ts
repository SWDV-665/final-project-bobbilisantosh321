import { Movie } from '../../interface/movie';
import { APP_CONFIG, AppConfig } from './../config/config';
import { Inject, Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/*
  Generated class for the MovieProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class MovieProvider {

  constructor(private http: Http, @Inject(APP_CONFIG) private config: AppConfig) {
    console.log('Hello MovieProvider Provider');
  }

  private getURLParams():URLSearchParams{
    const params: URLSearchParams = new URLSearchParams();
    params.set('api_key', this.config.apiKey);
    return params;
  }

  // API request to get Movie List
  getList(selection: string, page = '0'){
    const params = this.getURLParams();
    params.set("page", page);
    const reqOptions: RequestOptionsArgs = {
      params: params
    }
    console.log(page);
    return this.http.get(this.config.apiEndpoint+`/movie/${selection}`, reqOptions)
      .map(response =>  response.json().results as Movie[]);
  }

  // API request to search Movies
  searchMovie(term: string, page = '0'): Observable<Movie[]>{
    const params = this.getURLParams();
    params.set("query", term);
    params.set("page", page);
    const reqOptions: RequestOptionsArgs = {
      params: params
    }
    return this.http.get(this.config.apiEndpoint+"/search/movie", reqOptions)
      .map(response =>  response.json().results as Movie[]);
  }

  // API request to get Movie Details
  getMovieDetails(id: string) : Observable<Movie>{

    const params = this.getURLParams();
    params.set('append_to_response','videos');
    const reqOptions: RequestOptionsArgs = {
      params: params
    }

    return this.http.get(this.config.apiEndpoint+`/movie/${id}`, reqOptions)
      .map(response =>  response.json() as Movie);
  }
}
