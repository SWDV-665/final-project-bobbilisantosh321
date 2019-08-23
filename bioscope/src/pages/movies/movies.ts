import { Movie } from '../../interface/movie';
import { MovieProvider } from '../../providers/movie/movie';
import { MovieDetailPage } from './movie-detail/movie-detail';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { Subject, Subscription } from 'rxjs/Rx';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

/**
 * For lazy loading
 */
@IonicPage()
@Component({
  selector: "page-movies",
  templateUrl: "movies.html"
})
export class MoviesPage implements OnDestroy {

  movieSearch$: Subject<string> = new Subject<string>();
  movieSelection = "popular";
  endPages: boolean = false;
  private lastSearch: string;
  movies: Movie[] = [];
  private page: number = 0;
  private subscription: Subscription;


  @ViewChild(Content) content: Content;

  //Constructor for MoviePage
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private movieProvider: MovieProvider) {}

  //Helper Method to get Selection on user Search
  getSelection(selection: string) {
    this.reset();
    this.movieSearch$.next(selection);
  }

  //Method to reset the movie list while user is searching
  private reset(){
    this.page = 0;
    this.movies = [];
    this.endPages = false;
    this.content.scrollToTop(200);
  }

  //Method to search Movies
  searchMovie(search: string) {
    this.reset();
    this.movieSearch$.next(search);
  }

  //Notification function to determine if view is laoded
  ionViewDidLoad() {
    this.subscription = this.movieSearch$
      .debounceTime(400)
      .switchMap((search: string) => {
        search = !!!search ? this.movieSelection : search;

        const searchOpt: boolean =
          search === "now_playing" ||
          search === "popular" ||
          search === "top_rated" ||
          search === "upcoming" ||
          !!!search
            ? true
            : false;

        this.lastSearch = search;
        this.page++;
        if (searchOpt) {
          return this.movieProvider.getList(search, this.page.toString());
        } else {
          return this.movieProvider.searchMovie(search, this.page.toString());
        }
      })
      .subscribe((movies: Movie[]) => {
        this.movies = this.movies.concat(movies);

        console.log(this.endPages);

        if (movies.length === 0) {
          this.endPages = true;
        }
      });

    setTimeout(() => this.movieSearch$.next(""), 1000);
  }

  //Function to go to movie details page
  goToDetails(id: string) {
    this.navCtrl.push(MovieDetailPage, { id: id });
  }

  //Lazy loading for infiite laoding
  doInfinite(infiniteScroll) {
    this.movieSearch$.next(this.lastSearch);
    //infiniteScroll.enable(!this.endPages);
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
