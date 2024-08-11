import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent implements OnInit {
  isLoading: boolean = true; // Property to track loading state
  pokemon: any; // Property to store the Pokémon details

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Get Pokémon ID from route
    console.log('id', id);
    if (id) {
      this.pokemonService.getPokemonDetails(+id).subscribe(pokemon => {
        console.log('pokemon', pokemon);
        this.pokemon = pokemon;
        this.isLoading = false; // Set loading to false once data is loaded
      }, error => {
        console.error('Error fetching Pokémon details', error);
        this.isLoading = false; // Set loading to false even if there's an error
      });
    } else {
      this.isLoading = false; // Set loading to false if no ID is found
    }
  }
}
