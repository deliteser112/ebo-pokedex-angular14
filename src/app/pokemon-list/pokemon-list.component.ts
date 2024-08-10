import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';

interface PokemonType {
  name: string;
}

interface PokemonAbility {
  name: string;
}

interface Pokemon {
  name: string;
  url: string;
  id: number;
  image: string;
  gameIndex: number;
  baseExperience: number;
  height: number;
  weight: number;
  types: PokemonType[];
  abilities: PokemonAbility[];
}

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  sortedPokemonList: Pokemon[] = [];
  sortOption: string = 'default';
  isLoading = true;
  skeletonArray = Array(12); // Adjust the number based on the grid size

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.pokemonService.getPokemonList().subscribe(response => {
      this.pokemonList = response.results.map((pokemon: { name: string; url: string }) => {
        const id = pokemon.url.split('/').filter(part => part).pop();
        return {
          name: pokemon.name,
          url: pokemon.url,
          id: Number(id),  // Safely convert the id to a number
          image: '',       // Will be updated later with actual sprite URL
          gameIndex: 0,    // Will be updated later with actual game index
          baseExperience: 0,
          height: 0,
          weight: 0,
          types: [] as PokemonType[],       // Empty array with defined type
          abilities: [] as PokemonAbility[] // Empty array with defined type
        } as Pokemon;
      });

      this.pokemonList.forEach(pokemon => {
        this.pokemonService.getPokemonDetails(pokemon.id).subscribe(details => {
          pokemon.image = details.sprites.front_default;
          pokemon.gameIndex = details.game_indices[0]?.game_index || 0;
          pokemon.baseExperience = details.base_experience;
          pokemon.height = details.height;
          pokemon.weight = details.weight;
          pokemon.types = details.types.map((typeInfo: { type: { name: string } }) => typeInfo.type);
          pokemon.abilities = details.abilities.map((abilityInfo: { ability: { name: string } }) => abilityInfo.ability);
        });
      });

      this.sortPokemonList();
      this.isLoading = false; // Set loading to false once the data is loaded
    });
  }

  sortPokemonList() {
    if (this.sortOption === 'default') {
      this.sortedPokemonList = this.pokemonList;
    } else if (this.sortOption === 'pokedex') {
      this.sortedPokemonList = [...this.pokemonList].sort((a, b) => a.gameIndex - b.gameIndex);
    }
  }

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOption = selectElement.value;
    this.sortPokemonList();
  }
}
